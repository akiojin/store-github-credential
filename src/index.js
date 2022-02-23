const core = require('@actions/core')
const exec = require('@actions/exec');
const { v4: uuidv4 } = require('uuid');

export async function EnableKeychains(domain, path)
{
	var args = [ "list-keychains", "-d", domain, "-s", path ];
	await exec.exec('security', args);
}

export async function EnableUserKeychains(path)
{
	await EnableKeychains("user", path);
}

export async function EnableSystemKeychains(path)
{
	await EnableKeychains("system", path);
}

export async function EnableCommonKeychains(path)
{
	await EnableKeychains("common", path);
}

export async function EnableDynamicKeychains(path)
{
	await EnableKeychains("dynamic", path);
}

export async function EnableLoginUserKeychain()
{
	await EnableUserKeychains("~/Library/Keychains/login.keychain-db");
}

export async function GetTemporaryFile(text)
{
	var path = `${process.env.RUNNER_TEMP}/${uuidv4()}`;

	await fsPromises.writeFile(path, text);

	return path;
};

export async function GetTemporaryShellScript(text)
{
	var src = await GetTemporaryFile(text);
	var dst = `${path}.sh`;

	await fsPromises.rename(src, dst);
	await fsPromises.chmod(dst, fs.constants.R_OK | fs.constants.X_OK);

	return dst;
};

export async function StoreGitCredential(username, password)
{
	const credential = `
	git credential-manager-core store << EOS
	protocol=http
	host=github.com
	username=${username}
	password=${password}
	EOS`;
	
	const path = await GetTemporaryShellScript(credential);
	await exec.exec(`cat ${path}`);
	await exec.exec(path);
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