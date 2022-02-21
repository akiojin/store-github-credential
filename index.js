const core = require('@actions/core')
const github = require('@actions/github')
const process = require('child_process');

try {
  const username = core.getInput('username');
  const password = core.getInput('password');

  const credential = `
  git credential-manager-core store << EOS
  protocol=https
  host=github.com
  username=%s
  password=%s
  EOS
  `

  process.execFile('security', ['list-keychains', '-d user', '-s ~/Library/Keychains/login.keychain-db'], (error, stdout, stderr) => {
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

