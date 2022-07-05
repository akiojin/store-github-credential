import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import { Keychain } from '@akiojin/keychain'
import { BooleanStateValue, StringStateValue } from './StateHelper'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanStateValue('IS_POST_PROCESS')
const KeychainCache = new StringStateValue('KEYCHAIN')
const KeychainPasswordCache = new StringStateValue('KEYCHAIN_PASSWORD')

async function Run()
{
	try {
		const githubUsername: string = core.getInput('github-username')
		const githubPassword: string = core.getInput('github-password')

		if (!githubUsername) {
			throw new Error('github-username is null.')
		}
		if (!githubPassword) {
			throw new Error('github-password is null.')
		}

		let keychain: string = core.getInput('keychain')
		if (!keychain) {
			keychain = `${process.env.HOME}/Library/Keychains/login.keychain-db`
		}

		core.startGroup('Keychain Settings')
		{
			const keychainPassword: string = core.getInput('keychain-password')
			if (!!keychainPassword) {
				KeychainPasswordCache.Set(keychainPassword)
				core.setSecret(keychainPassword)
				await Keychain.UnlockKeychain(keychain, keychainPassword)
			}

			await Keychain.SetDefaultKeychain(keychain)
			await Keychain.SetListKeychain(keychain)

			KeychainCache.Set(keychain)
		}
		core.endGroup()

		core.startGroup('git credential-manager-core Settings')
		{
			await Credential.Configure()
			await Credential.Store(githubUsername, githubPassword)
		}
		core.endGroup()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	try {
		await Keychain.SetDefaultKeychain(KeychainCache.Get())
		await Keychain.UnlockKeychain(KeychainCache.Get(), KeychainPasswordCache.Get())
		await Credential.Erase()
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
