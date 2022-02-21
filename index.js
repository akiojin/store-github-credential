const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

function ImportLoginKeychain()
{
  exec.exec('security list-keychain -d user -s ~/Library/Keychains/login.keychain-db');
}

async function StoreGitHubCredential(username, password)
{
  await exec.exec(`
  git credential-manager-core store << EOS
  protocol=https
  host=github.com
  username=${username}
  password=${password}
  EOS
  `);
}

try {
  ImportLoginKeychain();
  StoreGitHubCredential();
} catch (ex) {
  core.setFailed(ex.message);
}

