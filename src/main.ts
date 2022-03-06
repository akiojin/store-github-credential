import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import { Security } from './Security'
import { BooleanStateValue, StringStateValue } from './StateHelper'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanStateValue('IS_POST_PROCESS')
const Keychain = new StringStateValue('KEYCHAIN')
const KeychainPassword = new StringStateValue('KEYCHAIN_PASSWORD')

async function Run()
{
	core.info('Running')

	try {
		const keychainPassword: string = core.getInput('keychain-password') || Math.random().toString(36)
		core.setSecret(keychainPassword)
		KeychainPassword.Set(keychainPassword)

		let keychain: string = core.getInput('keychain')
		if (keychain === '') {
			keychain = `${process.env.HOME}/Library/Keychains/default-login.keychain-db`

			await Security.CreateKeychain(keychain, keychainPassword)
			await Security.SetKeychainTimeout(keychain, +core.getInput('keychain-timeout'))

			Keychain.Set(keychain)
		}

		core.setOutput('keychain', keychain)
		core.setOutput('keychain-password', keychainPassword)

		await Security.UnlockKeychain(keychain)
		await Security.SetDefaultKeychain(keychain)
		await Security.SetListKeychains(keychain)

		await Security.ShowDefaultKeychain()
		await Security.ShowListKeychains()

		await Credential.Configure()
		await Credential.Store(core.getInput('github-username'), core.getInput('github-password'))
		await Credential.Get()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	core.info('Cleanup')

	try {
		if (Keychain.Get() === '') {
			await Security.DeleteKeychain(Keychain.Get())
		}
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

if (!IsMacOS) {
	core.setFailed('Action requires macOS agent.')
} else {
	if (!!PostProcess.Get()) {
		Cleanup()
	} else {
		Run()
	}
	
	PostProcess.Set(true)
}
