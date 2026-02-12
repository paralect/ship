/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_RESOURCES_PATH = path.resolve(
  __dirname,
  "../../../apps/api/src/resources",
);
const SCHEMAS_OUTPUT_PATH = path.resolve(__dirname, "../src/schemas");
const GENERATED_PATH = path.resolve(__dirname, "../src/generated");
const IGNORE_RESOURCES = ["token"];

// ─── Schema Sync ───────────────────────────────────────────────────────

function syncSchemas() {
  console.log("📋 Syncing schemas from API resources...");

  if (!fs.existsSync(SCHEMAS_OUTPUT_PATH)) {
    fs.mkdirSync(SCHEMAS_OUTPUT_PATH, { recursive: true });
  }

  // Find all *.schema.ts files in resources (including base.schema.ts)
  const schemaFiles: { src: string; relativePath: string }[] = [];

  // base.schema.ts in resources root
  const baseSchemaPath = path.join(API_RESOURCES_PATH, "base.schema.ts");
  if (fs.existsSync(baseSchemaPath)) {
    schemaFiles.push({ src: baseSchemaPath, relativePath: "base.schema.ts" });
  }

  // Resource-specific schemas
  const resources = fs
    .readdirSync(API_RESOURCES_PATH, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const resource of resources) {
    const resourceDir = path.join(API_RESOURCES_PATH, resource);
    const files = fs
      .readdirSync(resourceDir)
      .filter((f) => f.endsWith(".schema.ts"));

    for (const file of files) {
      schemaFiles.push({
        src: path.join(resourceDir, file),
        relativePath: `${resource}/${file}`,
      });
    }
  }

  // Copy and transform each schema file
  for (const { src, relativePath } of schemaFiles) {
    const content = fs.readFileSync(src, "utf-8");

    // No import rewriting needed — the relative paths in source schema files
    // (e.g. ../base.schema from account/account.schema.ts) already work correctly
    // in the shared package since we preserve the same directory structure.

    const outputPath = path.join(SCHEMAS_OUTPUT_PATH, relativePath);
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content);
    console.log(`   ✓ ${relativePath}`);
  }

  // Generate schemas/index.ts barrel
  const indexLines: string[] = ["export * from './base.schema';"];

  for (const resource of resources) {
    const resourceDir = path.join(API_RESOURCES_PATH, resource);
    const files = fs
      .readdirSync(resourceDir)
      .filter((f) => f.endsWith(".schema.ts"));

    for (const file of files) {
      const moduleName = file.replace(".ts", "");
      indexLines.push(`export * from './${resource}/${moduleName}';`);
    }
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
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function getResources(): string[] {
  return fs
    .readdirSync(API_RESOURCES_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !IGNORE_RESOURCES.includes(dirent.name))
    .map((dirent) => dirent.name);
}

function extractBalancedSchema(text: string): string | null {
  // Extract a schema expression that ends with `;` at depth 0
  // e.g. `userSchema\n  .pick({...})\n  .extend({...})\n  .partial();`
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
      } else if (char === ";" && depth === 0) {
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
  const simpleSchemaMatch = content.match(
    /export\s+const\s+schema\s*=\s*(\w+Schema)\s*;/,
  );
  if (simpleSchemaMatch) {
    const afterMatch = content.slice(
      content.indexOf(simpleSchemaMatch[0]) + simpleSchemaMatch[0].length - 1,
    );
    if (!afterMatch.startsWith("Schema.")) {
      return {
        schemaImport: simpleSchemaMatch[1],
        schemaName: simpleSchemaMatch[1],
        fullSchemaCode: null,
        isInlineSchema: false,
      };
    }
  }

  const exportedInlineStart = content.match(
    /export\s+const\s+schema\s*=\s*(paginationSchema|userSchema|z)\s*\./,
  );
  if (exportedInlineStart) {
    const matchIdx = content.indexOf(exportedInlineStart[0]);
    const startIdx =
      matchIdx + exportedInlineStart[0].indexOf(exportedInlineStart[1]);
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

  const inlineSchemaStart = content.match(
    /(?<!export\s+)const\s+schema\s*=\s*(paginationSchema|userSchema|z)\s*\./,
  );
  if (inlineSchemaStart) {
    const matchIdx = content.indexOf(inlineSchemaStart[0]);
    const startIdx =
      matchIdx + inlineSchemaStart[0].indexOf(inlineSchemaStart[1]);
    const schemaExpr = content.slice(startIdx);

    // Find the end of the schema expression using semicolon after balanced parens
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

  const zObjectMatch = content.match(
    /(?:export\s+)?const\s+schema\s*=\s*(z\.object\s*\([^)]*\))\s*;/,
  );
  if (zObjectMatch) {
    return {
      schemaImport: null,
      schemaName: "schema",
      fullSchemaCode: zObjectMatch[1],
      isInlineSchema: true,
    };
  }

  return {
    schemaImport: null,
    schemaName: null,
    fullSchemaCode: null,
    isInlineSchema: false,
  };
}

function extractResponseType(content: string): string | null {
  // Extract the handler body from createEndpoint
  const handlerMatch = content.match(/async\s+handler\s*\([^)]*\)\s*\{/);
  if (!handlerMatch) return null;

  const handlerStart =
    content.indexOf(handlerMatch[0]) + handlerMatch[0].length;

  // Find the handler body by matching braces
  let depth = 1;
  let i = handlerStart;
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") depth--;
    i++;
  }
  const handlerBody = content.slice(handlerStart, i - 1);

  // Find return statements (skip ones inside nested functions/callbacks)
  const returnStatements: string[] = [];
  const returnRegex = /\breturn\s+([^\s;][^;]*);/g;
  let match: RegExpExecArray | null = returnRegex.exec(handlerBody);
  while (match !== null) {
    // Check if this return is inside a nested function/arrow by looking
    // for function/arrow signatures before unmatched opening braces
    const before = handlerBody.slice(0, match.index);
    let insideNestedFn = false;
    let braceDepth = 0;

    for (let j = before.length - 1; j >= 0; j--) {
      if (before[j] === "}") braceDepth++;
      else if (before[j] === "{") {
        if (braceDepth > 0) {
          braceDepth--;
        } else {
          // Unmatched '{' — check what precedes it
          const preceding = before.slice(0, j).trimEnd();
          // Arrow function: => {  or function keyword
          if (
            /=>\s*$/.test(preceding) ||
            /\bfunction\s*\([^)]*\)\s*$/.test(preceding)
          ) {
            insideNestedFn = true;
            break;
          }
          // Otherwise it's an if/else/for/while block — still handler level
        }
      }
    }

    if (!insideNestedFn) {
      returnStatements.push(match[1].trim());
    }

    match = returnRegex.exec(handlerBody);
  }

  if (returnStatements.length === 0) return null;

  // Analyze return expressions
  for (const expr of returnStatements) {
    // Pattern: userService.getPublic(...)  or  ...then(userService.getPublic)
    if (/userService\.getPublic/.test(expr)) {
      // Check if it's a list result pattern: { ...result, results: ...map(userService.getPublic) }
      if (/results\s*:.*\.map\(userService\.getPublic\)/.test(expr)) {
        return "listResult(userPublicSchema)";
      }
      return "userPublicSchema";
    }

    // Pattern: inline object literal { key: value, ... }
    if (expr.startsWith("{")) {
      return inferObjectType(expr);
    }
  }

  return null;
}

function inferObjectType(expr: string): string | null {
  // Simple object literal like { emailVerificationToken }
  const shorthand = expr.match(/^\{\s*([\w,][\w\s,]*)\}$/);
  if (shorthand) {
    const keys = shorthand[1]
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const fields = keys.map((k) => `${k}: string`).join("; ");
    return `{ ${fields} }`;
  }
  return null;
}

async function getEndpoints(resourceName: string): Promise<ParsedEndpoint[]> {
  const endpointsPath = path.join(
    API_RESOURCES_PATH,
    resourceName,
    "endpoints",
  );

  if (!fs.existsSync(endpointsPath)) {
    return [];
  }

  const endpointFiles = fs
    .readdirSync(endpointsPath)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"));

  const endpoints: ParsedEndpoint[] = [];

  for (const file of endpointFiles) {
    const filePath = path.join(endpointsPath, file);
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

    const baseName = file.replace(".ts", "");
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
      responseType: extractResponseType(content),
    });
  }

  return endpoints;
}

function generateIndexFile(
  resources: string[],
  resourceEndpoints: Map<string, ParsedEndpoint[]>,
): string {
  const lines: string[] = [`import { z } from 'zod';`];

  // Collect all schema imports needed from ../schemas
  const allSchemaImports = new Set<string>();

  for (const [, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.schemaImport) {
        allSchemaImports.add(endpoint.schemaImport);
      }
      if (endpoint.fullSchemaCode) {
        const schemaNames =
          endpoint.fullSchemaCode.match(/\b(\w+Schema)\b/g) || [];
        schemaNames.forEach((name) => allSchemaImports.add(name));
      }
      // Collect schema imports needed for response types
      if (endpoint.responseType) {
        const schemaNames =
          endpoint.responseType.match(/\b(\w+Schema)\b/g) || [];
        schemaNames.forEach((name) => allSchemaImports.add(name));
        // If response uses listResult, import listResultSchema
        if (endpoint.responseType.includes("listResult(")) {
          allSchemaImports.add("listResultSchema");
        }
      }
    }
  }

  if (allSchemaImports.size > 0) {
    lines.push(
      `import { ${Array.from(allSchemaImports).sort().join(", ")} } from '../schemas';`,
    );
  }
  lines.push(`import { ApiClient } from '../client';`);
  lines.push("");

  // schemas object
  lines.push("export const schemas = {");

  for (const [resourceName, endpoints] of resourceEndpoints) {
    const schemaExports: string[] = [];

    for (const endpoint of endpoints) {
      if (endpoint.isInlineSchema && endpoint.fullSchemaCode) {
        schemaExports.push(`    ${endpoint.name}: ${endpoint.fullSchemaCode},`);
      } else if (endpoint.schemaImport) {
        schemaExports.push(`    ${endpoint.name}: ${endpoint.schemaImport},`);
      }
    }

    if (schemaExports.length > 0) {
      lines.push(`  ${resourceName}: {`);
      lines.push(...schemaExports);
      lines.push(`  },`);
    } else {
      lines.push(`  ${resourceName}: {},`);
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
        const paramsTypeName = `${toPascalCase(resourceName)}${toPascalCase(endpoint.name)}Params`;
        lines.push(
          `export type ${paramsTypeName} = z.infer<typeof schemas.${resourceName}.${endpoint.name}>;`,
        );
      }
    }
  }

  lines.push("");

  // Response types (inferred from handler return values)
  for (const [resourceName, endpoints] of resourceEndpoints) {
    for (const endpoint of endpoints) {
      if (endpoint.responseType) {
        const responseTypeName = `${toPascalCase(resourceName)}${toPascalCase(endpoint.name)}Response`;

        if (endpoint.responseType.startsWith("{")) {
          // Inline object type
          lines.push(
            `export type ${responseTypeName} = ${endpoint.responseType};`,
          );
        } else if (endpoint.responseType.includes("listResult(")) {
          // listResult(schema) → z.infer<ReturnType<typeof listResultSchema>>
          const innerSchema =
            endpoint.responseType.match(/listResult\((\w+)\)/)?.[1];
          if (innerSchema) {
            lines.push(
              `export type ${responseTypeName} = z.infer<ReturnType<typeof listResultSchema<typeof ${innerSchema}>>>;`,
            );
          }
        } else {
          // Schema reference like userPublicSchema
          lines.push(
            `export type ${responseTypeName} = z.infer<typeof ${endpoint.responseType}>;`,
          );
        }
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
        `      schema: ${schemaName ? `schemas.${resourceName}.${name}` : "undefined"},`,
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
          lines.push(`      call: (params: ${paramsTypeName}) =>`);
        } else {
          lines.push(`      call: (params?: Record<string, unknown>) =>`);
        }
        lines.push(
          `        client.${method}<${responseTypeName}>(${pathExpr}, params),`,
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
  lines.push(`    ? (params: TParams) => Promise<TResponse>`);
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

  if (!fs.existsSync(GENERATED_PATH)) {
    fs.mkdirSync(GENERATED_PATH, { recursive: true });
  }

  // Step 1: Sync schemas
  syncSchemas();

  // Step 2: Generate API client
  const resources = getResources();
  console.log(`📦 Found resources: ${resources.join(", ")}`);

  const resourceEndpoints = new Map<string, ParsedEndpoint[]>();
  const generatedResources: string[] = [];

  for (const resource of resources) {
    const endpoints = await getEndpoints(resource);

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
      const responseInfo = endpoint.responseType
        ? `response: ${endpoint.responseType}`
        : "void";
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

  fs.watch(API_RESOURCES_PATH, { recursive: true }, (_, filename) => {
    if (
      filename &&
      (filename.endsWith(".schema.ts") || filename.includes("endpoints/"))
    ) {
      debouncedGenerate();
    }
  });

  console.log("👀 Watching for changes in API resources...");
} else {
  await generate();
}
