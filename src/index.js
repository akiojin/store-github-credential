const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec');

async function EnableKeychains(domain, path)
{
	var args = [ "list-keychains", "-d", domain, "-s", path ];
	await exec.exec('security', args);
}

async function EnableUserKeychains(path)
{
	await EnableKeychains("user", path);
}

async function EnableSystemKeychains(path)
{
	await EnableKeychains("system", path);
}

async function EnableCommonKeychains(path)
{
	await EnableKeychains("common", path);
}

async function EnableDynamicKeychains(path)
{
	await EnableKeychains("dynamic", path);
}

async function EnableLoginUserKeychain()
{
	await EnableUserKeychains("~/Library/Keychains/login.keychain-db");
}

async function StoreGitCredential(username, password)
{
	var credential = `git credential-manager-core << EOS
protocol=http
host=github.com
username=${username}
password=${password}
EOS`;

	core.exportVariable('GIT_CREDENTIAL', credential);

	const temp = `${process.env.RUNNER_TEMP}/store-git-credential.sh`;
	await exec.exec(`/bin/bash -c "echo \\\"$GIT_CREDENTIAL\\\" | tee ${temp}"`);
	await exec.exec(`chmod +x ${temp}`);
	await exec.exec(temp);
}

async function Run()
{
	if (process.platform != 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await EnableLoginUserKeychain();
		await StoreGitCredential(core.getInput('username'), core.getInput('password'));
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

Run();