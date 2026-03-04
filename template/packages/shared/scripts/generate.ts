/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_RESOURCES_PATH = path.resolve(
  __dirname,
  "../../../apps/api/src/resources",
);
const API_ROOT = path.resolve(__dirname, "../../../apps/api");
const SCHEMAS_OUTPUT_PATH = path.resolve(__dirname, "../src/schemas");
const GENERATED_PATH = path.resolve(__dirname, "../src/generated");
const IGNORE_RESOURCES = ["token"];

// ─── Schema Extensions ────────────────────────────────────────────────

function applySchemaExtensions(
  content: string,
  schemaBaseName: string,
  extendInfos: { fileName: string; content: string }[],
): string {
  if (extendInfos.length === 0) return content;

  const extensions: { importName: string; importPath: string }[] = [];

  for (const { fileName, content: extContent } of extendInfos) {
    const match = extContent.match(/export\s+const\s+(\w+)\s*=/);
    if (!match) continue;
    extensions.push({
      importName: match[1],
      importPath: `./${fileName.replace(".ts", "")}`,
    });
  }

  if (extensions.length === 0) return content;

  const lines = content.split("\n");

  // Add imports after the last existing import
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*import\s/.test(lines[i])) {
      lastImportIndex = i;
    }
  }

  const importStatements = extensions.map(
    (e) => `import { ${e.importName} } from '${e.importPath}';`,
  );
  lines.splice(lastImportIndex + 1, 0, ...importStatements);

  let result = lines.join("\n");

  // Find the schema variable and append .extend() calls
  const schemaVarName = `${schemaBaseName}Schema`;
  const defRegex = new RegExp(`export\\s+const\\s+${schemaVarName}\\s*=`);
  const defMatch = result.match(defRegex);

  if (!defMatch || defMatch.index === undefined) return result;

  const afterEquals = defMatch.index + defMatch[0].length;

  // Track balanced brackets (with string awareness) to find end of expression
  let depth = 0;
  let foundStart = false;
  let endIndex = -1;
  let inString = false;
  let stringChar = "";

  for (let i = afterEquals; i < result.length; i++) {
    const char = result[i];
    const prevChar = i > 0 ? result[i - 1] : "";

    if (!inString && (char === '"' || char === "'" || char === "`")) {
      inString = true;
      stringChar = char;
      continue;
    }
    if (inString) {
      if (char === stringChar && prevChar !== "\\") {
        inString = false;
      }
      continue;
    }

    if (char === "(" || char === "{" || char === "[") {
      depth++;
      foundStart = true;
    } else if (char === ")" || char === "}" || char === "]") {
      depth--;
      if (foundStart && depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) return result;

  const extendCalls = extensions
    .map((e) => `.extend(${e.importName})`)
    .join("");
  result =
    result.substring(0, endIndex + 1) +
    extendCalls +
    result.substring(endIndex + 1);

  return result;
}

// ─── Schema Sync ───────────────────────────────────────────────────────

function syncSchemas() {
  console.log("📋 Syncing schemas from API resources...");

  if (!fs.existsSync(SCHEMAS_OUTPUT_PATH)) {
    fs.mkdirSync(SCHEMAS_OUTPUT_PATH, { recursive: true });
  }

  const schemaFiles: { src: string; relativePath: string }[] = [];

  const baseSchemaPath = path.join(API_RESOURCES_PATH, "base.schema.ts");
  if (fs.existsSync(baseSchemaPath)) {
    schemaFiles.push({ src: baseSchemaPath, relativePath: "base.schema.ts" });
  }

  const findSchemasRecursively = (dir: string, baseDir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        findSchemasRecursively(path.join(dir, entry.name), baseDir);
      } else if (
        entry.name.endsWith(".schema.ts") ||
        entry.name.endsWith(".extend.ts")
      ) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path
          .relative(baseDir, fullPath)
          .split(path.sep)
          .join("/");
        if (relativePath !== "base.schema.ts") {
          schemaFiles.push({ src: fullPath, relativePath });
        }
      }
    }
  };

  findSchemasRecursively(API_RESOURCES_PATH, API_RESOURCES_PATH);

  // Group extend files by their base schema for auto-extension
  const extendsBySchema = new Map<
    string,
    { fileName: string; src: string }[]
  >();
  for (const { src, relativePath } of schemaFiles) {
    if (!relativePath.endsWith(".extend.ts")) continue;
    const dir = path.dirname(relativePath);
    const baseName = path.basename(relativePath).split(".")[0];
    const key = `${dir}/${baseName}`;
    if (!extendsBySchema.has(key)) extendsBySchema.set(key, []);
    extendsBySchema.get(key)!.push({
      fileName: path.basename(relativePath),
      src,
    });
  }

  for (const { src, relativePath } of schemaFiles) {
    let content = fs.readFileSync(src, "utf-8");
    const outputPath = path.join(SCHEMAS_OUTPUT_PATH, relativePath);
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Auto-apply .extend() for matching *.extend.ts files
    if (
      relativePath.endsWith(".schema.ts") &&
      relativePath !== "base.schema.ts"
    ) {
      const dir = path.dirname(relativePath);
      const baseName = path.basename(relativePath, ".schema.ts");
      const key = `${dir}/${baseName}`;
      const matchingExtends = extendsBySchema.get(key);

      if (matchingExtends && matchingExtends.length > 0) {
        const extendInfos = matchingExtends.map((e) => ({
          fileName: e.fileName,
          content: fs.readFileSync(e.src, "utf-8"),
        }));
        content = applySchemaExtensions(content, baseName, extendInfos);
        const extNames = matchingExtends.map((e) => e.fileName).join(", ");
        console.log(`   ✓ ${relativePath} (+ ${extNames})`);
      } else {
        console.log(`   ✓ ${relativePath}`);
      }
    } else {
      console.log(`   ✓ ${relativePath}`);
    }

    fs.writeFileSync(outputPath, content);
  }

  const indexLines: string[] = [];
  for (const { relativePath } of schemaFiles) {
    if (relativePath.endsWith(".extend.ts")) continue;
    const moduleName = relativePath.replace(".ts", "");
    indexLines.push(`export * from './${moduleName}';`);
  }

  fs.writeFileSync(
    path.join(SCHEMAS_OUTPUT_PATH, "index.ts"),
    `${indexLines.join("\n")}\n`,
  );
  console.log(`   ✓ index.ts (barrel)`);
}

// ─── API Client Generation ─────────────────────────────────────────────

interface ParsedEndpoint {
  name: string;
  method: string;
  path: string;
  hasPathParams: boolean;
  pathParams: string[];
  schemaImport: string | null;
  schemaName: string | null;
  fullSchemaCode: string | null;
  isInlineSchema: boolean;
  responseType: string | null; // inferred from handler return
}

function toCamelCase(str: string): string {
  return str.replace(/[-/]([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function findResourcesWithEndpoints(dir: string, baseDir: string): string[] {
  const resources: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || IGNORE_RESOURCES.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const endpointsPath = path.join(fullPath, "endpoints");

    if (
      fs.existsSync(endpointsPath) &&
      fs.statSync(endpointsPath).isDirectory()
    ) {
      resources.push(
        path.relative(baseDir, fullPath).split(path.sep).join("/"),
      );
    }

    resources.push(...findResourcesWithEndpoints(fullPath, baseDir));
  }

  return resources;
}

function getResources(): string[] {
  return findResourcesWithEndpoints(API_RESOURCES_PATH, API_RESOURCES_PATH);
}

function extractBalancedSchema(text: string): string | null {
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : "";

    if (!inString && (char === '"' || char === "'" || char === "`")) {
      inString = true;
      stringChar = char;
    } else if (inString && char === stringChar && prevChar !== "\\") {
      inString = false;
    }

    if (!inString) {
      if (char === "(" || char === "{" || char === "[") {
        depth++;
      } else if (char === ")" || char === "}" || char === "]") {
        depth--;
      } else if ((char === ";" || char === ",") && depth === 0) {
        return text.slice(0, i).trimEnd();
      }
    }
  }
  return null;
}

function extractSchemaFromContent(content: string): {
  schemaImport: string | null;
  schemaName: string | null;
  fullSchemaCode: string | null;
  isInlineSchema: boolean;
} {
  // Pattern 1: schema: someSchema inside createEndpoint({...})
  const createEndpointSchemaMatch = content.match(
    /schema\s*:\s*(\w+Schema)\s*[,\n}]/,
  );
  if (createEndpointSchemaMatch) {
    const schemaName = createEndpointSchemaMatch[1];

    const localDefRegex = new RegExp(`(?:const|let)\\s+${schemaName}\\s*=\\s*`);
    const isLocalDef = localDefRegex.test(content);

    if (isLocalDef) {
      const defMatch = content.match(
        new RegExp(`(?:const|let)\\s+${schemaName}\\s*=\\s*`),
      );
      if (defMatch) {
        const startIdx = content.indexOf(defMatch[0]) + defMatch[0].length;
        const schemaExpr = content.slice(startIdx);
        const schemaCode = extractBalancedSchema(schemaExpr);
        if (schemaCode) {
          return {
            schemaImport: null,
            schemaName,
            fullSchemaCode: schemaCode,
            isInlineSchema: true,
          };
        }
      }
    }

    return {
      schemaImport: schemaName,
      schemaName,
      fullSchemaCode: null,
      isInlineSchema: false,
    };
  }

  // Pattern 1b: Shorthand schema, in createEndpoint with local const schema = ...
  const shorthandSchemaMatch = content.match(
    /createEndpoint\s*\(\s*\{[\s\S]*?\bschema\s*[,\n}]/,
  );
  if (shorthandSchemaMatch) {
    const localSchemaMatch = content.match(/(?:const|let)\s+schema\s*=\s*/);
    if (localSchemaMatch) {
      const startIdx =
        content.indexOf(localSchemaMatch[0]) + localSchemaMatch[0].length;
      const schemaExpr = content.slice(startIdx);
      const schemaCode = extractBalancedSchema(schemaExpr);
      if (schemaCode) {
        return {
          schemaImport: null,
          schemaName: "schema",
          fullSchemaCode: schemaCode,
          isInlineSchema: true,
        };
      }
    }
  }

  // Pattern 2: export const schema = someSchema;
  const simpleSchemaMatch = content.match(
    /export\s+const\s+schema\s*=\s*(\w+Schema)\s*;/,
  );
  if (simpleSchemaMatch) {
    return {
      schemaImport: simpleSchemaMatch[1],
      schemaName: simpleSchemaMatch[1],
      fullSchemaCode: null,
      isInlineSchema: false,
    };
  }

  // Pattern 3: inline schema expressions (schema: z.object(...) or schema: someSchema.extend(...))
  const inlineSchemaStart = content.match(/schema\s*:\s*(z\.|\w+Schema\.)/);
  if (inlineSchemaStart) {
    const matchIdx = content.indexOf(inlineSchemaStart[0]);
    const startIdx = matchIdx + "schema: ".length;
    const schemaExpr = content.slice(startIdx);
    const schemaCode = extractBalancedSchema(schemaExpr);
    if (schemaCode) {
      return {
        schemaImport: null,
        schemaName: "schema",
        fullSchemaCode: schemaCode,
        isInlineSchema: true,
      };
    }
  }

  return {
    schemaImport: null,
    schemaName: null,
    fullSchemaCode: null,
    isInlineSchema: false,
  };
}

// ─── Return Type Inference (TypeScript Compiler) ───────────────────────

function inferAllReturnTypes(endpointFiles: string[]): Map<string, string> {
  const configPath = path.join(API_ROOT, "tsconfig.json");
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    console.warn(
      "⚠️  Could not read API tsconfig.json, skipping return type inference",
    );
    return new Map();
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    API_ROOT,
  );

  const program = ts.createProgram(endpointFiles, parsedConfig.options);
  const checker = program.getTypeChecker();
  const result = new Map<string, string>();

  for (const filePath of endpointFiles) {
    const returnType = inferSingleReturnType(checker, program, filePath);
    if (returnType) {
      result.set(filePath, returnType);
    }
  }

  return result;
}

function inferSingleReturnType(
  checker: ts.TypeChecker,
  program: ts.Program,
  filePath: string,
): string | null {
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return null;

  let handlerNode: ts.MethodDeclaration | undefined;

  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isExportAssignment(node) &&
      !node.isExportEquals &&
      ts.isCallExpression(node.expression)
    ) {
      const arg = node.expression.arguments[0];
      if (arg && ts.isObjectLiteralExpression(arg)) {
        for (const prop of arg.properties) {
          if (
            ts.isMethodDeclaration(prop) &&
            prop.name &&
            ts.isIdentifier(prop.name) &&
            prop.name.text === "handler"
          ) {
            handlerNode = prop;
          }
        }
      }
    }
  });

  if (!handlerNode?.body) return null;

  const returnTypes: ts.Type[] = [];

  function visitReturns(node: ts.Node) {
    if (
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionDeclaration(node)
    ) {
      return;
    }
    if (ts.isReturnStatement(node) && node.expression) {
      returnTypes.push(checker.getTypeAtLocation(node.expression));
    }
    ts.forEachChild(node, visitReturns);
  }

  ts.forEachChild(handlerNode.body, visitReturns);

  if (returnTypes.length === 0) return null;

  const dataTypes = returnTypes.filter(
    (t) =>
      !(
        t.flags &
        (ts.TypeFlags.Void |
          ts.TypeFlags.Undefined |
          ts.TypeFlags.Never |
          ts.TypeFlags.Unknown |
          ts.TypeFlags.Any)
      ),
  );

  if (dataTypes.length === 0) return null;

  const primaryType = dataTypes[dataTypes.length - 1];
  let resolved = primaryType;

  if (
    resolved.symbol?.name === "Promise" ||
    checker.typeToString(resolved).startsWith("Promise<")
  ) {
    const typeArgs = checker.getTypeArguments(resolved as ts.TypeReference);
    if (typeArgs?.[0]) resolved = typeArgs[0];
  }

  if (
    resolved.flags &
    (ts.TypeFlags.Void |
      ts.TypeFlags.Undefined |
      ts.TypeFlags.Unknown |
      ts.TypeFlags.Any)
  ) {
    return null;
  }

  const serialized = serializeType(checker, resolved);
  if (
    !serialized ||
    serialized === "void" ||
    serialized === "undefined" ||
    serialized === "unknown" ||
    serialized === "any"
  ) {
    return null;
  }

  return serialized;
}

function serializeType(
  checker: ts.TypeChecker,
  type: ts.Type,
  depth = 0,
): string {
  if (depth > 6) return "unknown";

  if (type.symbol?.name === "Date") return "string";

  const primitiveFlags =
    ts.TypeFlags.String |
    ts.TypeFlags.Number |
    ts.TypeFlags.Boolean |
    ts.TypeFlags.BooleanLiteral |
    ts.TypeFlags.Null |
    ts.TypeFlags.Undefined |
    ts.TypeFlags.Void |
    ts.TypeFlags.Never |
    ts.TypeFlags.Any |
    ts.TypeFlags.Unknown |
    ts.TypeFlags.BigInt |
    ts.TypeFlags.StringLiteral |
    ts.TypeFlags.NumberLiteral |
    ts.TypeFlags.BigIntLiteral;

  if (type.flags & primitiveFlags) {
    return checker.typeToString(type);
  }

  if (type.isUnion()) {
    const parts = type.types
      .map((t) => serializeType(checker, t, depth + 1))
      .filter((s) => s !== "void" && s !== "undefined" && s !== "never");
    const unique = [...new Set(parts)];
    if (unique.length === 0) return "void";
    return unique.length === 1 ? unique[0] : unique.join(" | ");
  }

  if (type.isIntersection()) {
    const properties = checker.getPropertiesOfType(type);
    if (properties.length > 0) {
      return serializeObjectProperties(checker, properties, depth);
    }
  }

  if (type.flags & ts.TypeFlags.Object) {
    if (type.symbol?.name === "Promise") {
      const typeArgs = checker.getTypeArguments(type as ts.TypeReference);
      if (typeArgs?.[0]) return serializeType(checker, typeArgs[0], depth + 1);
    }

    if (checker.isArrayType(type)) {
      const typeArgs = checker.getTypeArguments(type as ts.TypeReference);
      if (typeArgs?.[0]) {
        const elem = serializeType(checker, typeArgs[0], depth + 1);
        return elem.includes("|") || elem.includes("{")
          ? `(${elem})[]`
          : `${elem}[]`;
      }
      return "unknown[]";
    }

    const properties = checker.getPropertiesOfType(type);
    if (properties.length > 0) {
      return serializeObjectProperties(checker, properties, depth);
    }
  }

  const result = checker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.NoTruncation,
  );
  return result.replace(/\bDate\b/g, "string");
}

function serializeObjectProperties(
  checker: ts.TypeChecker,
  properties: ts.Symbol[],
  depth: number,
): string {
  const members: string[] = [];

  for (const prop of properties) {
    const decl = prop.valueDeclaration || prop.declarations?.[0];
    if (!decl) continue;

    const propType = checker.getTypeOfSymbolAtLocation(prop, decl);
    const optional = prop.flags & ts.SymbolFlags.Optional ? "?" : "";
    const serialized = serializeType(checker, propType, depth + 1);
    members.push(`${prop.name}${optional}: ${serialized}`);
  }

  if (members.length === 0) return "Record<string, unknown>";

  return `{ ${members.join("; ")} }`;
}

// ─── Endpoint Parsing ──────────────────────────────────────────────────

function getEndpointFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getEndpointFiles(fullPath));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getEndpoints(
  resourceName: string,
  returnTypeMap: Map<string, string>,
): ParsedEndpoint[] {
  const endpointsPath = path.join(
    API_RESOURCES_PATH,
    resourceName,
    "endpoints",
  );

  if (!fs.existsSync(endpointsPath)) {
    return [];
  }

  const endpointFiles = getEndpointFiles(endpointsPath);
  const endpoints: ParsedEndpoint[] = [];

  for (const filePath of endpointFiles) {
    const content = fs.readFileSync(filePath, "utf-8");

    let method: string | null = null;
    let endpointPath: string | null = null;

    const createEndpointStart = content.match(
      /createEndpoint(?:<[^>]+>)?\s*\(\s*\{/,
    );
    if (createEndpointStart) {
      const afterCreateEndpoint = content.slice(
        content.indexOf(createEndpointStart[0]),
      );
      const methodMatch = afterCreateEndpoint.match(
        /method\s*:\s*['"](\w+)['"]/,
      );
      const pathMatch = afterCreateEndpoint.match(
        /path\s*:\s*['"]([^'"]+)['"]/,
      );

      if (methodMatch && pathMatch) {
        method = methodMatch[1];
        endpointPath = pathMatch[1];
      }
    }

    if (!method || !endpointPath) {
      const endpointMatch = content.match(
        /export\s+const\s+endpoint\s*(?::\s*EndpointConfig\s*)?=\s*\{([^}]+)\}/,
      );

      if (endpointMatch) {
        const configBlock = endpointMatch[1];
        const methodMatch = configBlock.match(/method\s*:\s*['"](\w+)['"]/);
        const pathMatch = configBlock.match(/path\s*:\s*['"]([^'"]+)['"]/);

        if (methodMatch && pathMatch) {
          method = methodMatch[1];
          endpointPath = pathMatch[1];
        }
      }
    }

    if (!method || !endpointPath) continue;

    const pathParams = (endpointPath.match(/:(\w+)/g) || []).map((p) =>
      p.slice(1),
    );
    const hasPathParams = pathParams.length > 0;

    const schemaInfo = extractSchemaFromContent(content);

    const baseName = path.basename(filePath, ".ts");
    const name = toCamelCase(baseName);

    endpoints.push({
      name,
      method,
      path: endpointPath,
      hasPathParams,
      pathParams,
      schemaImport: schemaInfo.schemaImport,
      schemaName: schemaInfo.schemaName,
      fullSchemaCode: schemaInfo.fullSchemaCode,
      isInlineSchema: schemaInfo.isInlineSchema,
      responseType: returnTypeMap.get(filePath) || null,
    });
  }

  return endpoints;
}

function generateIndexFile(
  resources: string[],
  resourceEndpoints: Map<string, ParsedEndpoint[]>,
): string {
  const lines: string[] = [`import { z } from 'zod';`];

  const allSchemaImports = new Set<string>();
  const allEnumImports = new Set<string>();

  for (const [, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.schemaImport) {
        allSchemaImports.add(endpoint.schemaImport);
      }
      if (endpoint.fullSchemaCode) {
        const schemaNames =
          endpoint.fullSchemaCode.match(/\b(\w+Schema)\b/g) || [];
        schemaNames.forEach((name) => allSchemaImports.add(name));

        const enumMatches =
          endpoint.fullSchemaCode.match(/z\.enum\((\w+)\)/g) || [];
        enumMatches.forEach((match) => {
          const enumName = match.match(/z\.enum\((\w+)\)/)?.[1];
          if (enumName && !enumName.startsWith("[")) {
            allEnumImports.add(enumName);
          }
        });
      }
    }
  }

  if (allSchemaImports.size > 0) {
    lines.push(
      `import { ${Array.from(allSchemaImports).sort().join(", ")} } from '../schemas';`,
    );
  }
  if (allEnumImports.size > 0) {
    lines.push(
      `import { ${Array.from(allEnumImports).sort().join(", ")} } from 'enums';`,
    );
  }
  lines.push(`import { ApiClient } from '../client';`);
  lines.push("");

  // schemas object
  lines.push("export const schemas = {");

  for (const [resourceName, endpoints] of resourceEndpoints) {
    const key = toCamelCase(resourceName);
    const schemaExports: string[] = [];

    for (const endpoint of endpoints) {
      if (endpoint.isInlineSchema && endpoint.fullSchemaCode) {
        schemaExports.push(`    ${endpoint.name}: ${endpoint.fullSchemaCode},`);
      } else if (endpoint.schemaImport) {
        schemaExports.push(`    ${endpoint.name}: ${endpoint.schemaImport},`);
      }
    }

    if (schemaExports.length > 0) {
      lines.push(`  ${key}: {`);
      lines.push(...schemaExports);
      lines.push(`  },`);
    } else {
      lines.push(`  ${key}: {},`);
    }
  }

  lines.push("} as const;");
  lines.push("");

  // Path param types
  for (const [resourceName, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.hasPathParams) {
        const typeName = `${toPascalCase(resourceName)}${toPascalCase(endpoint.name)}PathParams`;
        const pathParamsType = `{ ${endpoint.pathParams.map((p) => `${p}: string`).join("; ")} }`;
        lines.push(`export type ${typeName} = ${pathParamsType};`);
      }
    }
  }

  lines.push("");

  // Param types
  for (const [resourceName, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.schemaName) {
        const key = toCamelCase(resourceName);
        const paramsTypeName = `${toPascalCase(resourceName)}${toPascalCase(endpoint.name)}Params`;
        lines.push(
          `export type ${paramsTypeName} = z.infer<typeof schemas.${key}.${endpoint.name}>;`,
        );
      }
    }
  }

  lines.push("");

  // Response types (auto-inferred from handler return types)
  for (const [resourceName, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.responseType) {
        const responseTypeName = `${toPascalCase(resourceName)}${toPascalCase(endpoint.name)}Response`;
        lines.push(
          `export type ${responseTypeName} = ${endpoint.responseType};`,
        );
      }
    }
  }

  lines.push("");

  // Endpoint creator functions
  for (const [resourceName, endpoints] of resourceEndpoints) {
    const pascalName = toPascalCase(resourceName);

    lines.push(`function create${pascalName}Endpoints(client: ApiClient) {`);
    lines.push("  return {");

    for (const endpoint of endpoints) {
      const {
        name,
        method,
        path: endpointPath,
        hasPathParams,
        schemaName,
      } = endpoint;
      const key = toCamelCase(resourceName);
      const fullPath = `/${resourceName}${endpointPath === "/" ? "" : endpointPath}`;

      const paramsTypeName = schemaName
        ? `${toPascalCase(resourceName)}${toPascalCase(name)}Params`
        : "Record<string, unknown>";

      const pathParamsTypeName = hasPathParams
        ? `${toPascalCase(resourceName)}${toPascalCase(name)}PathParams`
        : "never";

      let pathExpr = `'${fullPath}'`;
      if (hasPathParams) {
        // eslint-disable-next-line no-template-curly-in-string
        pathExpr = `\`${fullPath.replace(/:(\w+)/g, "${options.pathParams.$1}")}\``;
      }

      const responseTypeName = endpoint.responseType
        ? `${toPascalCase(resourceName)}${toPascalCase(name)}Response`
        : "void";

      lines.push(`    ${name}: {`);
      lines.push(`      method: '${method}' as const,`);
      lines.push(`      path: '${fullPath}' as const,`);
      lines.push(
        `      schema: ${schemaName ? `schemas.${key}.${name}` : "undefined"},`,
      );

      if (hasPathParams) {
        if (schemaName) {
          lines.push(
            `      call: (params: ${paramsTypeName}, options: { pathParams: ${pathParamsTypeName}; headers?: Record<string, string> }) =>`,
          );
        } else {
          lines.push(
            `      call: (params: Record<string, unknown> | undefined, options: { pathParams: ${pathParamsTypeName}; headers?: Record<string, string> }) =>`,
          );
        }
        lines.push(
          `        client.${method}<${responseTypeName}>(${pathExpr}, params, options.headers ? { headers: options.headers } : undefined),`,
        );
      } else {
        if (schemaName) {
          lines.push(
            `      call: (params: ${paramsTypeName}, options?: { headers?: Record<string, string> }) =>`,
          );
        } else {
          lines.push(
            `      call: (params?: Record<string, unknown>, options?: { headers?: Record<string, string> }) =>`,
          );
        }
        lines.push(
          `        client.${method}<${responseTypeName}>(${pathExpr}, params, options?.headers ? { headers: options.headers } : undefined),`,
        );
      }
      lines.push(`    },`);
    }

    lines.push("  };");
    lines.push("}");
    lines.push("");
  }

  lines.push("export function createApiEndpoints(client: ApiClient) {");
  lines.push("  return {");

  for (const resource of resources) {
    const camelName = toCamelCase(resource);
    const pascalName = toPascalCase(resource);
    lines.push(`    ${camelName}: create${pascalName}Endpoints(client),`);
  }

  lines.push("  };");
  lines.push("}");
  lines.push("");

  lines.push(
    "export type ApiEndpoints = ReturnType<typeof createApiEndpoints>;",
  );
  lines.push("");

  lines.push(
    `export interface ApiEndpoint<TParams = unknown, TPathParams = never, TResponse = unknown> {`,
  );
  lines.push(`  method: 'get' | 'post' | 'put' | 'patch' | 'delete';`);
  lines.push(`  path: string;`);
  lines.push(`  schema: z.ZodType | undefined;`);
  lines.push(`  call: TPathParams extends never`);
  lines.push(
    `    ? (params: TParams, options?: { headers?: Record<string, string> }) => Promise<TResponse>`,
  );
  lines.push(
    `    : (params: TParams, options: { pathParams: TPathParams; headers?: Record<string, string> }) => Promise<TResponse>;`,
  );
  lines.push(`}`);
  lines.push("");

  lines.push(
    "export type InferParams<T> = T extends { schema: infer S } ? (S extends z.ZodType ? z.infer<S> : Record<string, unknown>) : Record<string, unknown>;",
  );
  lines.push("");
  lines.push(
    "export type InferPathParams<T> = T extends { call: (params: unknown, options: { pathParams: infer PP }) => unknown } ? PP : never;",
  );
  lines.push("");
  lines.push(
    "export type InferResponse<T> = T extends { call: (...args: never[]) => Promise<infer R> } ? R : unknown;",
  );
  lines.push("");

  return lines.join("\n");
}

// ─── Main ───────────────────────────────────────────────────────────────

async function generate() {
  console.log("🔍 Scanning API resources...");

  syncSchemas();

  if (!fs.existsSync(GENERATED_PATH)) {
    fs.mkdirSync(GENERATED_PATH, { recursive: true });
  }

  const resources = getResources();
  console.log(`📦 Found resources: ${resources.join(", ")}`);

  const allEndpointFiles: string[] = [];
  for (const resource of resources) {
    const endpointsPath = path.join(API_RESOURCES_PATH, resource, "endpoints");
    if (fs.existsSync(endpointsPath)) {
      allEndpointFiles.push(...getEndpointFiles(endpointsPath));
    }
  }

  console.log("🔬 Inferring handler return types...");
  const returnTypeMap = inferAllReturnTypes(allEndpointFiles);
  console.log(`   ✓ Inferred ${returnTypeMap.size} response types`);

  const resourceEndpoints = new Map<string, ParsedEndpoint[]>();
  const generatedResources: string[] = [];

  for (const resource of resources) {
    const endpoints = getEndpoints(resource, returnTypeMap);

    if (endpoints.length === 0) {
      console.log(`⏭️  Skipping ${resource}: no endpoints found`);
      continue;
    }

    console.log(`✨ Processing ${resource} (${endpoints.length} endpoints)`);

    for (const endpoint of endpoints) {
      const schemaInfo = endpoint.schemaName
        ? endpoint.isInlineSchema
          ? "inline schema"
          : `import: ${endpoint.schemaImport}`
        : "no schema";
      const responseInfo = endpoint.responseType ? "inferred" : "void";
      console.log(
        `   - ${endpoint.name}: ${endpoint.method.toUpperCase()} ${endpoint.path} (${schemaInfo}, ${responseInfo})`,
      );
    }

    resourceEndpoints.set(resource, endpoints);
    generatedResources.push(resource);
  }

  const indexContent = generateIndexFile(generatedResources, resourceEndpoints);
  fs.writeFileSync(path.join(GENERATED_PATH, "index.ts"), indexContent);

  console.log("✅ Generation complete!");
}

// Watch mode support
const isWatch = process.argv.includes("--watch");

if (isWatch) {
  const { watch } = await import("chokidar");

  console.log("👀 Starting watch mode...");
  await generate();

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const debouncedGenerate = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.log("\n🔄 Changes detected, regenerating...");
      await generate();
    }, 300);
  };

  const watcher = watch(API_RESOURCES_PATH, {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
  });

  watcher.on("all", (_event: string, filePath: string) => {
    if (filePath.includes("endpoints/") || filePath.endsWith(".schema.ts")) {
      debouncedGenerate();
    }
  });

  console.log("👀 Watching for changes in API resources...");
} else {
  await generate();
}
