import * as core from '@actions/core'
import * as os from 'os'
import * as exec from '@actions/exec'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'
import { Security } from './Security'
import { v4 as uuidv4 } from 'uuid'

const IsPost = !!process.env['STATE_IsPost']
const CustomKeychain = `${process.env.HOME}/Library/Keychains/login.keychain-db`

function AllowPostProcess()
{
	coreCommand.issueCommand('save-state', { name: 'IsPost' }, 'true')
}

async function Run()
{
	core.info('Running')

	if (os.platform() !== 'darwin') {
		core.setFailed('Action requires macOS agent.')
	}
	
	try {
		const password = core.getInput('keychain-password') || uuidv4()
		coreCommand.issueCommand('save-state', { name: 'KEYCHAIN_PASSWORD' }, password)

		await Security.CreateKeychain(CustomKeychain, password)
		await Security.SetDefaultKeychain(CustomKeychain)
		await Security.SetLoginKeychain(CustomKeychain)
		await Security.UnlockKeychain(CustomKeychain)

		await Credential.Configure()
		await Credential.Store(core.getInput('username'), core.getInput('password'))
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	core.info('Cleanup')

	try {
		await Security.SetDefaultKeychain(CustomKeychain)
		await Security.SetLoginKeychain(CustomKeychain)
		await Security.DeleteKeychain(CustomKeychain)
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function UnlockLoginKeychain(password?: string)
{
	core.info('list-keychain Before:');
	await Security.ShowListKeychains();

	await Security.SetListKeychains(CustomKeychain)

	core.info('list-keychain After:');
	await Security.ShowListKeychains();

	if (password != null && password !== '') {
		await Security.UnlockKeychain(password, CustomKeychain)
	}
}

if (!!IsPost) {
	Cleanup()
} else {
	Run()
}

AllowPostProcess()
