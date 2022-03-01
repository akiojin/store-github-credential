import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import * as execa from 'execa'
import { Security } from './Security'
import { FileSystem } from './FileSystem'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'

var GetTemporaryShellScript = async function(text) {
	const src = await FileSystem.GetTemporaryFile(text);
	const dst = `${src}.sh`;

	await fsPromises.rename(src, dst);
	await exec.exec(`chmod +x ${dst}`)

	return dst;
};

var Execute = async function(command) {
	await execa.execa(command);
};

async function Run()
{
	core.notice('Running');

	if (process.platform !== 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await Credential.Configure();

		await Security.EnableDefaultLoginKeychain();
		await Credential.Store(core.getInput('username'), core.getInput('password'));
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

async function Cleanup()
{
	core.notice('Cleanup');

	try {
		await Security.EnableDefaultLoginKeychain();
		await Credential.Erase();
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

const IsPost = !!process.env['STATE_IsPost']

if (!!IsPost) {
	Cleanup();
} else {
	Run();
}

if (!IsPost) {
	coreCommand.issueCommand('save-state', {name: 'IsPost'}, 'true')
}
