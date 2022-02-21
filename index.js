const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('child_process');

function ImportLoginKeychain()
{
	exec.execSync('security list-keychains -d user -s ~/Library/Keychains/login.keychain-db');
}

function OutputStdin(gcm, command)
{
	gcm.stdin.write(command);
	gcm.stdin.end();
}

function StoreGitHubCredential(username, password)
{
	const gcm = exec.exec(
		'git credential-manager-core store',
		(err, stdout, stderr) => {
			if (err) {
				core.setFailed(err);
			} else {
				console.log(stdout);
			}
		});

	OutputStdin('protocol=https');
	OutputStdin('host=github.com');
	OutputStdin(`username=${username}`);
	OutputStdin(`password=${password}`);
}

try {
	ImportLoginKeychain();
	StoreGitHubCredential();
} catch (ex) {
	core.setFailed(ex.message);
}

