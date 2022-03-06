import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import { Security } from './Security'
import { BooleanStateValue, StringStateValue } from './StateHelper'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanStateValue('IS_POST_PROCESS')
const Keychain = new StringStateValue('KEYCHAIN')

async function Run()
{
	try {
		const githubUsername: string = core.getInput('github-username')
		const githubPassword: string = core.getInput('github-password')

		if (githubUsername === '') {
			throw new Error('github-username is null.')
		}
		if (githubPassword === '') {
			throw new Error('github-password is null.')
		}

		let keychain: string = core.getInput('keychain')
		if (keychain === '') {
			keychain = `${process.env.HOME}/Library/Keychains/login.keychain-db`
		}

		const keychainPassword: string = core.getInput('keychain-password')
		if (keychainPassword !== '') {
			core.setSecret(keychainPassword)
			await Security.UnlockKeychain(keychain, keychainPassword)
		}

		await Security.SetDefaultKeychain(keychain)
		await Security.SetListKeychains(keychain)

		await Security.SetDefaultKeychain(keychain)
		await Security.SetListKeychains(keychain)

		await Security.ShowDefaultKeychain()
		await Security.ShowListKeychains()

		await Credential.Configure()
		await Credential.Store(githubUsername, githubPassword)
		await Credential.Get()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

async function Cleanup()
{
	try {
		await Security.SetDefaultKeychain(Keychain.Get())
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
