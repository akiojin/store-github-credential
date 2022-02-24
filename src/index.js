import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import * as execa from 'execa'

var EnableKeychains = async function(domain, path) {
	var args = [ "list-keychains", "-d", domain, "-s", path ];
	await exec.exec('security', args);
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
	const base64 = `Z2l0IGNyZWRlbnRpYWwtbWFuYWdlci1jb3JlIHN0b3JlIDw8IEVPUwpwcm90b2NvbD1odHRwcwpob3N0PWdpdGh1Yi5jb20KdXNlcm5hbWU9JEdJVF9DUkVERU5USUFMX1VTRVJOQU1FCnBhc3N3b3JkPSRHSVRfQ1JFREVOVElBTF9QQVNTV09SRApFT1MK`;
	
	const bin = Buffer.from(base64, 'base64');

	core.exportVariable('GIT_CREDENTIAL_USERNAME', username);
	core.exportVariable('GIT_CREDENTIAL_PASSWORD', password);

	await execa.execa(bin.toString());
//	const path = await GetTemporaryShellScript(bin.toString());
//	await exec.exec(path);
//	await exec.exec(bin.toString());
}

async function Run()
{
	if (process.platform !== 'darwin') {
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