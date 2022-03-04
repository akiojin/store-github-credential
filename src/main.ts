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

function LoadKeychainPassword()
{
	return process.env['STATE_KEYCHAIN_PASSWORD'];
}

function SaveKeychainPassword(password: string)
{
	coreCommand.issueCommand('save-state', { name: 'KEYCHAIN_PASSWORD' }, password)
}

async function Run()
{
	core.info('Running')

	try {
		const password = core.getInput('keychain-password') || 'default-keychain-password'
		SaveKeychainPassword(password)

		await Security.CreateKeychain(CustomKeychain, password)
		await Security.SetDefaultKeychain(CustomKeychain)
		await Security.SetListKeychains(CustomKeychain)
		await Security.UnlockKeychain(CustomKeychain)

		await Security.ShowDefaultKeychain()
		await Security.ShowListKeychains()

		await Credential.Configure()
		await Credential.Store(core.getInput('username'), core.getInput('password'))
		await Credential.Get()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	core.info('Cleanup')

	try {
		await Security.SetDefaultKeychain(CustomKeychain)
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
