import fs from 'fs';
import path from 'path';

import {
  actionCreateContent,
  actionGetContent,
  actionRemoveContent,
  actionUpdateContent,
  indexContent,
  routesContent,
  schemaContent,
  serviceContent,
  typeContent,
} from './resources-templates';

const createDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } else {
    console.error(`Directory already exists: ${dirPath}`);
  }
};

const createFile = (filePath: string, content = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`File created: ${filePath}`);
  } else {
    console.error(`File already exists: ${filePath}`);
  }
};

const modifyPublicRoutes = (name: string) => {
  const filePath = path.join(process.cwd(), 'apps', 'api', 'src', 'routes', 'public.routes.ts');
  const importStatement = `import { ${name}Routes } from 'resources/${name}';\n`;
  const routeUseStatement = `  app.use(mount('/${name}s', ${name}Routes.publicRoutes));`;

  try {
    let data = fs.readFileSync(filePath, 'utf8');

    const lines = data.split('\n');

    if (!data.includes(importStatement)) {
      lines.splice(0, 0, importStatement);
    }

    const exportDefaultIndex = lines.findIndex((line) => line.trim().startsWith('export default'));

    if (exportDefaultIndex > -1) {
      let insertIndex = exportDefaultIndex;

      while (insertIndex < lines.length && !lines[insertIndex].trim().startsWith('}')) {
        // eslint-disable-next-line no-plusplus
        insertIndex++;
      }

      lines.splice(insertIndex - 1, 0, routeUseStatement);
    }

    data = lines.join('\n');

    fs.writeFileSync(filePath, data, 'utf8');
    console.log('File has been updated successfully.');
  } catch (err) {
    console.error('Failed to update the file:', err);
  }
};

const addToPackageIndex = (directory: string, name: string, type: string) => {
  const indexPath = path.join(directory, 'index.ts');
  const exportLine = `export * from './${name}.${type}';\n`;

  if (fs.existsSync(indexPath)) {
    const data = fs.readFileSync(indexPath, 'utf8');
    const newData = exportLine + data;

    fs.writeFileSync(indexPath, newData);
  } else {
    fs.writeFileSync(indexPath, exportLine);
  }
};

export const createResource = async (name: string) => {
  const cwd = process.cwd();
  const baseDir = path.join(cwd, 'apps', 'api', 'src', 'resources', name);
  const schemasDir = path.join(cwd, 'packages', 'schemas', 'src');
  const appTypesDir = path.join(cwd, 'packages', 'app-types', 'src');

  createDirectory(baseDir);
  createDirectory(path.join(baseDir, 'actions'));

  const files = [
    { path: 'index.ts', content: indexContent(name) },
    { path: `${name}.service.ts`, content: serviceContent(name) },
    { path: `${name}.routes.ts`, content: routesContent() },
    { path: 'actions/create.ts', content: actionCreateContent(name) },
    { path: 'actions/get.ts', content: actionGetContent(name) },
    { path: 'actions/update.ts', content: actionUpdateContent(name) },
    { path: 'actions/remove.ts', content: actionRemoveContent(name) },
  ];

  files.forEach(({ path: filePath, content }) => {
    createFile(path.join(baseDir, filePath), content);
  });

  createFile(path.join(schemasDir, `${name}.schema.ts`), schemaContent(name));
  createFile(path.join(appTypesDir, `${name}.types.ts`), typeContent(name));

  addToPackageIndex(schemasDir, name, 'schema');
  addToPackageIndex(appTypesDir, name, 'types');

  modifyPublicRoutes(name);
};
