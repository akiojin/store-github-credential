const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

function ImportLoginKeychain()
{
	exec.exec('security list-keychains -d user -s ~/Library/Keychains/login.keychain-db');
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
		}
	);

	gcm.stdin.write('protocol=https');
	gcm.stdin.write('host=github.com');
	gcm.stdin.write(`username=${username}`);
	gcm.stdin.write(`password=${password}`);
	gcm.stdin.end();
}

console.log(`platform=${process.platform}`);

try {
	ImportLoginKeychain();
	StoreGitHubCredential();
} catch (ex) {
	core.setFailed(ex.message);
}

