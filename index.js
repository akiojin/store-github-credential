const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

async function ImportLoginKeychain()
{
	await exec.exec('security list-keychains -d user -s ~/Library/Keychains/login.keychain-db');
}

async function StoreGitHubCredential(username, password)
{
	output = '';
	error = '';

	const options = {
		input: () => {
			console.log('@@@@@@@@@@@@@');
			return Buffer.from(
				`protocol=https
				host=github.com
				username=${username}
				password=${password}`
			);
		},
		listeners: {
			stdout: (data) => {
				output += data.toString();
			},
			stderr: (err) => {
				error += err.toString();
			}
		}
	};

	await exec.exec('git', ['credential-manager-core', 'store'], options);

	if (error != '') {
		core.setFailed(error);
	} else {
		console.log(output);
	}
}

async function Execute()
{
	if (process.platform != 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await ImportLoginKeychain();
		await StoreGitHubCredential(core.getInput('username'), core.getInput('password'));
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

Execute();