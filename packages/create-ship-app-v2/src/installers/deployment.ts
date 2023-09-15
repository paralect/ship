import path from 'path';
import { promises as fs } from 'fs';

import { replaceTextInFile } from 'helpers';
import { DEPLOYMENT } from 'types';

type DeploymentInstallerOptions = {
  projectRoot: string;
  repoName: string;
  projectName: string;
};

export const deploymentInstaller = async (deployment: DEPLOYMENT, options: DeploymentInstallerOptions) => {
  const { projectRoot, repoName, projectName } = options;

  const templatePath = path.join(projectRoot, repoName, 'deploy');

  try {
    switch (deployment) {
      case DEPLOYMENT.DIGITAL_OCEAN_APPS: {
        const workflowsSrc = path.join(templatePath, 'digital-ocean-apps/koa/.github/workflows');
        const workflowsDest = path.join(projectRoot, '.github/workflows');

        await fs.cp(workflowsSrc, workflowsDest, { recursive: true });
        break;
      }

      case DEPLOYMENT.RENDER: {
        const renderSrc = path.join(templatePath, 'render/koa/render.yaml');
        const renderDest = path.join(projectRoot, 'render.yaml');

        await fs.rename(renderSrc, renderDest);

        await replaceTextInFile(renderDest, repoName, projectName);
        break;
      }

      case DEPLOYMENT.DIGITAL_OCEAN_KUBERNETES: {
        const workflowsSrc = path.join(templatePath, 'aws/.github/workflows');
        const workflowsDest = path.join(projectRoot, '.github/workflows');

        await fs.cp(workflowsSrc, workflowsDest, { recursive: true });

        const deploySrc = path.join(templatePath, 'aws/deploy');
        const deployDest = path.join(projectRoot, 'deploy');

        await fs.cp(deploySrc, deployDest, { recursive: true });
        break;
      }

      case DEPLOYMENT.AWS_KUBERNETES: {
        const workflowsSrc = path.join(templatePath, 'digital-ocean/.github/workflows');
        const workflowsDest = path.join(projectRoot, '.github/workflows');

        await fs.cp(workflowsSrc, workflowsDest, { recursive: true });

        const deploySrc = path.join(templatePath, 'digital-ocean/deploy');
        const deployDest = path.join(projectRoot, 'deploy');

        await fs.cp(deploySrc, deployDest, { recursive: true });
        break;
      }

      default: break;
    }
  } catch (e) {
    console.log(e);
  }
};
