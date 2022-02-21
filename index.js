const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

function ImportLoginKeychain()
{
	exec.exec('security list-keychains -d user -s ~/Library/Keychains/login.keychain-db');
}

async function StoreGitHubCredential(username, password)
{
	const options = {
		input: () => {
			return `protocol=https
			host=github.com
			username=${username}
			password=${password}`
		},
		listeners: {
			stdout: (data) => {
				console.log(data);
			},
			stderr: (err) => {
				core.setFailed(err);
			}
		}
	};

	await exec.exec('git credential-manager-core store', options);
}

if (process.platform != 'darwin') {
	core.setFailed('Platform not supported.');
}

try {
	ImportLoginKeychain();
	StoreGitHubCredential();
} catch (ex) {
	core.setFailed(ex.message);
}

