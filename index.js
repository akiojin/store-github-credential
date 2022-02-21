const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

async function StoreGitHubCredential()
{
  await exec.exec('./Store-GitHub-Credential.sh');
}

try {
  core.exportVariable('GIT_CREDENTIAL_USERNAME', core.getInput('username'));
  core.exportVariable('GIT_CREDENTIAL_PASSWORD', core.getInput('password'));

  StoreGitHubCredential();
} catch (ex) {
  core.setFailed(ex.message);
}

