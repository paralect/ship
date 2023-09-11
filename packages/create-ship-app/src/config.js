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
    [`${deploymentTypes.AWS_EKS}`]: 'aws/koa',
    [`${deploymentTypes.DIGITAL_OCEAN_MANAGED_KUBERNETES}`]: 'digital-ocean/koa',
    [`${deploymentTypes.DIGITAL_OCEAN_APPS}`]: 'digital-ocean-apps/koa',
    [`${deploymentTypes.RENDER}`]: 'render/koa',
  }
}

module.exports = {
  deploymentTypes,
  deploymentFolders,
}
