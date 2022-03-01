import * as core from '@actions/core'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'

async function Run()
{
	core.notice('Running');

	if (process.platform !== 'darwin') {
		core.setFailed('Platform not supported.');
	}
	
	try {
		await Credential.Configure();
		await Credential.Store(core.getInput('username'), core.getInput('password'));
	} catch (ex) {
		core.setFailed(ex.message);
	}
}

async function Cleanup()
{
	core.notice('Cleanup');

	try {
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
	core.saveState('IsPost', 'true');
}
