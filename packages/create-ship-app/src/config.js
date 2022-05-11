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
  common: {
    [deploymentTypes.AWS]: 'aws/common',
    [deploymentTypes.DIGITAL_OCEAN]: 'digital-ocean'
  },
  specific: {
    [`${deploymentTypes.AWS}${apiTypes.KOA}`]: 'aws/koa',
    [`${deploymentTypes.AWS}${apiTypes.DOTNET}${dbTypes.NOSQL}`]: 'aws/dotnet-nosql',
    [`${deploymentTypes.AWS}${apiTypes.DOTNET}${dbTypes.SQL}`]: 'aws/dotnet-sql',
    [`${deploymentTypes.DIGITAL_OCEAN}${apiTypes.KOA}`]: 'digital-ocean/koa',
    [`${deploymentTypes.DIGITAL_OCEAN}${apiTypes.DOTNET}${dbTypes.NOSQL}`]: 'digital-ocean/dotnet-nosql',
    [`${deploymentTypes.DIGITAL_OCEAN}${apiTypes.DOTNET}${dbTypes.SQL}`]: 'digital-ocean/dotnet-sql',
  }
}

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
  apiFolders,
}
