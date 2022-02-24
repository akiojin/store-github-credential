import * as core from '@actions/core'
import * as exec from '@actions/exec'
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

var GetTemporaryFile = async function (text, options) {
	const path = GenerateTemporaryFilename();
	await fsPromises.writeFile(path, text, options);
	return path;
};

var GetTemporaryShellScript = async function(text) {
	const options = {
		encoding: "utf8",
		flag: "w",
		mode: 0o777
	};

	const src = await GetTemporaryFile(text, options);
	const dst = `${src}.sh`;

	await fsPromises.rename(src, dst);
	await fsPromises.chmod(dst, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);

	return dst;
};

var StoreGitCredential = async function(username, password) {
	process.env.CREDENTIAL = `protocol=https\\nhost=github.com\\nusername=${username}\\npassword=${password}`;
	await exec.exec(`echo "$CREDENTIAL" | git credential-manager-core store`);
};

var GetGitCredential = async function() {
	process.env.CREDENTIAL = 'protocol=https\\nhost=github.com';
	await exec.exec(`echo "$CREDENTIAL" | git credential-manager-core get`);
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