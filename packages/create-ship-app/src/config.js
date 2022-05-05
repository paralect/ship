const buildTypes = {
  FULL_STACK: 'Full-Stack (Frontend, Backend, Deploy)',
  ONLY_FRONTEND: 'Only Frontend',
  ONLY_BACKEND: 'Only Backend',
};

const apiTypes = {
  KOA: 'Koa.js',
  DOTNET: '.NET',
};

const dbTypes = {
  NOSQL: 'MongoDB',
  SQL: 'PostgreSQL',
};

const deploymentTypes = {
  DIGITAL_OCEAN: 'Digital Ocean',
  AWS: 'AWS'
};

const deploymentFolders = {
  [deploymentTypes.DIGITAL_OCEAN]: 'digital-ocean',
  [deploymentTypes.AWS]: 'aws',
};

const apiFolders = {
  [apiTypes.KOA]: 'api-koa',
  [apiTypes.DOTNET]: 'api-dotnet',
};

module.exports = {
  buildTypes,
  apiTypes,
  dbTypes,
  deploymentTypes,
  deploymentFolders,
  apiFolders
}
