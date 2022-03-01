import * as core from '@actions/core'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'

const IsPost = !!process.env['STATE_IsPost']

function AllowPostProcess()
{
	coreCommand.issueCommand('save-state', { name: 'IsPost' }, 'true');
}

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

if (!!IsPost) {
	Cleanup();
} else {
	Run();
}

AllowPostProcess();
