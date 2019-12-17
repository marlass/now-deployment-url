const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;

const zeitToken = core.getInput('zeit-token');
const zeitTeamId = core.getInput('zeit-team-id');
const zeitAPIClient = axios.create({
  baseURL: 'https://api.zeit.co',
  headers: {
    Authorization: `Bearer ${zeitToken}`,
  },
  params: {
    teamId: zeitTeamId || undefined,
  },
});

async function run() {
  await getDeploymentUrl();
}

async function getDeploymentUrl() {
  let deploymentUrl;

  const {
    data: {
      deployments: [commitDeployment],
    },
  } = await zeitAPIClient.get('/v4/now/deployments', {
    params: {
      'meta-githubCommitSha': context.sha,
    },
  });

  if (commitDeployment) {
    deploymentUrl = commitDeployment.url;
  } else {
    const {
      data: {
        deployments: [lastBranchDeployment],
      },
    } = await zeitAPIClient.get('/v4/now/deployments', {
      params: {
        'meta-githubCommitRef': context.ref,
      },
    });

    if (lastBranchDeployment) {
      deploymentUrl = lastBranchDeployment.url;
    } else {
      const {
        data: {
          deployments: [lastDeployment],
        },
      } = await zeitAPIClient.get('/v4/now/deployments', {
        params: {
          limit: 1,
        },
      });

      if (lastDeployment) {
        deploymentUrl = lastDeployment.url;
      }
    }
  }
  console.log(deploymentUrl);
  core.setOutput('preview-url', `https://${deploymentUrl}`);
}

run().catch(error => {
  core.setFailed(error.message);
});
