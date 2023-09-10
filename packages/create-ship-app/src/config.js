const apiTypes = {
  KOA: 'Koa.js',
  DOTNET: '.NET',
};

const dbTypes = {
  NOSQL: 'MongoDB',
  SQL: 'PostgreSQL',
};

const deploymentTypes = {
  DIGITAL_OCEAN_APPS: 'Digital Ocean Apps',
  RENDER: 'Render',
  DIGITAL_OCEAN_MANAGED_KUBERNETES: 'Digital Ocean Managed Kubernetes',
  AWS_EKS: 'AWS EKS'
};

const deploymentFolders = {
  common: {
    [deploymentTypes.AWS_EKS]: 'aws/common',
    [deploymentTypes.DIGITAL_OCEAN_MANAGED_KUBERNETES]: 'digital-ocean/common',
    [deploymentTypes.DIGITAL_OCEAN_APPS]: 'digital-ocean-apps/common',
    [deploymentTypes.RENDER]: 'render/common',
  },
  specific: {
    [`${deploymentTypes.AWS_EKS}${apiTypes.KOA}`]: 'aws/koa',
    [`${deploymentTypes.AWS_EKS}${apiTypes.DOTNET}${dbTypes.NOSQL}`]: 'aws/dotnet-nosql',
    [`${deploymentTypes.AWS_EKS}${apiTypes.DOTNET}${dbTypes.SQL}`]: 'aws/dotnet-sql',
    [`${deploymentTypes.DIGITAL_OCEAN_MANAGED_KUBERNETES}${apiTypes.KOA}`]: 'digital-ocean/koa',
    [`${deploymentTypes.DIGITAL_OCEAN_MANAGED_KUBERNETES}${apiTypes.DOTNET}${dbTypes.NOSQL}`]: 'digital-ocean/dotnet-nosql',
    [`${deploymentTypes.DIGITAL_OCEAN_MANAGED_KUBERNETES}${apiTypes.DOTNET}${dbTypes.SQL}`]: 'digital-ocean/dotnet-sql',
    [`${deploymentTypes.DIGITAL_OCEAN_APPS}${apiTypes.KOA}`]: 'digital-ocean-apps/koa',
    [`${deploymentTypes.RENDER}${apiTypes.KOA}`]: 'render/koa',
  }
}

module.exports = {
  apiTypes,
  dbTypes,
  deploymentTypes,
  deploymentFolders,
}
