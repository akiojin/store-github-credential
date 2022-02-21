const core = require('@actions/core')
const github = require('@actions/github')
const proc = require('child_process');

try {
  const username = core.getInput('username');
  const password = core.getInput('password');

  process.env.GIT_CREDENTIAL_USERNAME = core.getInput('username');
  process.env.GIT_CREDENTIAL_PASSWORD = core.getInput('password');

  proc.exec('./Store-GitHub-Credential.sh', (error, stdout, stderr) => {
    if (error) {
      console.log('ERROR', error);
      core.setFailed(error);
    } else {
      console.log('username: ', username);
      console.log('password: ', password);

      console.log('STDOUT', stdout);
      console.log('STDERR', stderr);
    }
  });
} catch (ex) {
  core.setFailed(ex.message);
}

