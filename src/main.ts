import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import { Security } from './Security'
import { BooleanStateValue, StateHelper, StringStateValue } from './StateHelper'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanStateValue('IS_POST_PROCESS')
const KeychainCreated = new BooleanStateValue('KEYCHAIN_CREATED')
const Keychain = new StringStateValue('KEYCHAIN')
const KeychainPassword = new StringStateValue('KEYCHAIN_PASSWORD')

async function Run()
{
	core.info('Running')

	try {
		const keychainPassword: string = core.getInput('keychain-password') || Math.random().toString(36)
		core.setSecret(keychainPassword)
		KeychainPassword.Set(keychainPassword)

		var keychain: string = core.getInput('keychain')
		if (keychain === '') {
			keychain = `${process.env.HOME}/Library/Keychains/default-login.keychain-db`

			await Security.CreateKeychain(keychain, keychainPassword)

			KeychainCreated.Set(true)
			Keychain.Set(keychain)
		} else {
			KeychainCreated.Set(false)
		}

		core.setOutput('keychain', keychain)
		core.setOutput('keychain-password', keychainPassword)

		await Security.SetDefaultKeychain(keychain)
		await Security.SetListKeychains(keychain)
		await Security.UnlockKeychain(keychain)

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
		if (!!KeychainCreated.Get()) {
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
