import * as core from '@actions/core'
import * as os from 'os'
import * as exec from '@actions/exec'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'
import { Security } from './Security'

const IsPost = !!process.env['STATE_IsPost']

function AllowPostProcess()
{
	coreCommand.issueCommand('save-state', { name: 'IsPost' }, 'true')
}

async function Run()
{
	core.notice('Running')

	if (os.platform() !== 'darwin') {
		core.setFailed('Action requires macOS agent.')
	}
	
	try {
		const password = core.getInput('keychain-password')
		coreCommand.issueCommand('save-state', { name: 'KEYCHAIN_PASSWORD' }, password)

		await UnlockLoginKeychain(password)
		await Credential.Configure()
		await Credential.Store(core.getInput('username'), core.getInput('password'))
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	core.notice('Cleanup')

	try {
		await UnlockLoginKeychain(process.env['STATE_KEYCHAIN_PASSWORD'])
		await Credential.Erase()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function UnlockLoginKeychain(password?: string)
{
	await Security.ListKeychains();
	const keychain = `${process.env.HOME}/Library/Keychains/login.keychain-db`
	await Security.ListKeychains(keychain)
	await Security.ListKeychains();

	if (password != null && password !== '') {
		await Security.Lock(keychain);
		await Security.Unlock(password, keychain)
	}
}

if (!!IsPost) {
	Cleanup()
} else {
	Run()
}

AllowPostProcess()
