import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import * as coreCommand from '@actions/core/lib/command'
import { Security } from './Security'

const IsPost = !!process.env[`STATE_POST`]
const IsMacOS = os.platform() === 'darwin'
const CustomKeychain = `${process.env.HOME}/Library/Keychains/default-login.keychain-db`

function AllowPostProcess()
{
	coreCommand.issueCommand('save-state', { name: 'POST' }, 'true')
}

async function Run()
{
	core.info('Running')

	try {
		const password = core.getInput('keychain-password') || 'default-keychain-password'
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

if (!IsMacOS) {
	core.setFailed('Action requires macOS agent.')
} else {
	if (!!IsPost) {
		Cleanup()
	} else {
		Run()
	}
	
	AllowPostProcess()
}
