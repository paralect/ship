import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

import config from 'config';

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
  webApiIndexContent,
  webResourceContent,
} from './resources-templates';

import { lintDir } from './lintDir';

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

const modifyPrivateRoutes = (name: string, cwd: string) => {
  const filePath = path.join(cwd, 'apps', 'api', 'src', 'routes', 'private.routes.ts');
  const importStatement = `import { ${name}Routes } from 'resources/${name}';\n`;
  const routeUseStatement = `  app.use(mount('/${pluralize
    .plural(name)}', compose([auth, ${name}Routes.privateRoutes])));`;

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
        insertIndex++;
      }

      lines.splice(insertIndex - 1, 0, routeUseStatement);
    }

    data = lines.join('\n');

    fs.writeFileSync(filePath, data, 'utf8');
    console.log('File private.routes.ts has been updated successfully.');
  } catch (err) {
    console.error('Failed to update the private.routes.ts file:', err);
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

const updateApiConstants = (name: string, cwd: string) => {
  const filePath = path.join(cwd, 'packages', 'app-constants', 'src', 'api.constants.ts');
  const content = fs.readFileSync(filePath, 'utf8').split('\n');

  const dbIndex = content.findIndex((line) => line.includes('DATABASE_DOCUMENTS'));

  if (dbIndex !== -1) {
    const entryLine = `${' '.repeat(2)}${pluralize.plural(name.toUpperCase())}: '${pluralize.plural(name)}',`;

    content.splice(dbIndex + 1, 0, entryLine);

    fs.writeFileSync(filePath, content.join('\n'), 'utf8');

    console.log('Document added to DATABASE_DOCUMENTS successfully.');
  } else {
    console.error('DATABASE_DOCUMENTS not found in api.constants.ts');
  }
};

export const createResource = async (name: string) => {
  let cwd = process.cwd();

  if (config.USE_LOCAL_REPO) {
    cwd = path.join(cwd, '..', '..', 'template');
  }

  const resourcesDir = (resource: string) => path.join(cwd, 'apps', resource, 'src', 'resources', name);
  const schemasDir = path.join(cwd, 'packages', 'schemas', 'src');
  const appTypesDir = path.join(cwd, 'packages', 'app-types', 'src');

  updateApiConstants(name, cwd);

  createDirectory(resourcesDir('api'));
  createDirectory(resourcesDir('web'));
  createDirectory(path.join(resourcesDir('api'), 'actions'));

  const files = [
    { path: 'index.ts', content: indexContent(name), resource: 'api' },
    { path: `${name}.service.ts`, content: serviceContent(name), resource: 'api' },
    { path: `${name}.routes.ts`, content: routesContent(), resource: 'api' },
    { path: 'actions/create.ts', content: actionCreateContent(name), resource: 'api' },
    { path: 'actions/get.ts', content: actionGetContent(name), resource: 'api' },
    { path: 'actions/update.ts', content: actionUpdateContent(name), resource: 'api' },
    { path: 'actions/remove.ts', content: actionRemoveContent(name), resource: 'api' },
    { path: 'index.ts', content: webApiIndexContent(name), resource: 'web' },
    { path: `${name}.api.ts`, content: webResourceContent(name), resource: 'web' },
  ];

  files.forEach(({ path: filePath, content, resource }) => {
    createFile(path.join(resourcesDir(resource), filePath), content);
  });

  createFile(path.join(schemasDir, `${name}.schema.ts`), schemaContent(name));
  createFile(path.join(appTypesDir, `${name}.types.ts`), typeContent(name));

  addToPackageIndex(schemasDir, name, 'schema');
  addToPackageIndex(appTypesDir, name, 'types');

  modifyPrivateRoutes(name, cwd);

  await lintDir(cwd);
};
