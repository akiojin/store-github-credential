import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManagerCore as Credential } from './GitCredentialManagerCore'
import { Keychain } from '@akiojin/keychain'
import { BooleanStateValue, StringStateValue } from './StateHelper'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanStateValue('IS_POST_PROCESS')
const KeychainCache = new StringStateValue('KEYCHAIN')
const KeychainPasswordCache = new StringStateValue('KEYCHAIN_PASSWORD')

async function SettingKeychain()
{
  core.startGroup('Keychain Settings')

  let keychain: string = core.getInput('keychain')
  if (!keychain) {
    keychain = `${process.env.HOME}/Library/Keychains/login.keychain-db`
	core.info('Use the default login keychain')
  }

  const keychainPassword: string = core.getInput('keychain-password')
  if (!!keychainPassword) {
    KeychainPasswordCache.Set(keychainPassword)
    core.setSecret(keychainPassword)
    await Keychain.UnlockKeychain(keychain, keychainPassword)
  }

  await Keychain.SetDefaultKeychain(keychain)
  await Keychain.SetListKeychain(keychain)

  KeychainCache.Set(keychain)

  core.endGroup()
}

async function SettingCredential()
{
  core.startGroup('git credential-manager-core Settings')

  await Credential.Configure()

  try {
	await Credential.Get()
  } catch (ex: any) {
    await Credential.Store(core.getInput('github-username'), core.getInput('github-password'))
  }

  core.endGroup()
}

async function Run()
{
  try {
    await SettingKeychain()
    await SettingCredential()
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
