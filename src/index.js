import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import * as execa from 'execa'

var EnableKeychains = async function(domain, path) {
	var args = [ "list-keychains", "-d", domain, "-s", path ];
	await execa.execa('security', args);
}

var EnableUserKeychains = async function(path) {
	await EnableKeychains("user", path);
}

var EnableSystemKeychains = async function(path) {
	await EnableKeychains("system", path);
}

var EnableCommonKeychains = async function(path) {
	await EnableKeychains("common", path);
}

var EnableDynamicKeychains = async function(path) {
	await EnableKeychains("dynamic", path);
}

var EnableLoginUserKeychain = async function() {
	await EnableUserKeychains("~/Library/Keychains/login.keychain-db");
}

var GenerateTemporaryFilename = function() {
	return `${process.env.RUNNER_TEMP}/${uuidv4()}`;
};

var GetTemporaryFile = async function(text) {
	const path = GenerateTemporaryFilename();
	await fsPromises.writeFile(path, text);
	return path;
};

var GetTemporaryShellScript = async function(text) {
	const src = await GetTemporaryFile(text);
	const dst = `${src}.sh`;

	await fsPromises.rename(src, dst);
	await exec.exec(`chmod +x ${dst}`)
	await exec.exec(`cat ${dst}`);

	return dst;
};

var Execute = async function(command) {
	await exec.exec(command);
};

var StoreGitCredential = async function(username, password) {
	const path = await GetTemporaryShellScript(`protocol=https\\nhost=github.com\\nusername=${username}\\npassword=${password}`);
	await Execute(`ls -la ${process.env.RUNNER_TEMP}`);
	await Execute(`echo "${path}"`);
	await Execute(`cat ${path}`);
	await Execute(path);
};

var GetGitCredential = async function() {
	await Execute(`echo "protocol=https\\nhost=github.com" | git credential-manager-core get`);
};

async function Run()
{
	if (process.platform !== 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await EnableLoginUserKeychain();
		await StoreGitCredential(core.getInput('username'), core.getInput('password'));
		await GetGitCredential();
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

Run();