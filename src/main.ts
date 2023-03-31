import * as core from '@actions/core'
import * as os from 'os'
import { GitCredentialManager } from '@akiojin/git-credential-manager-helper'
import { Keychain } from '@akiojin/keychain'
import { BooleanEnvironment, StringEnvironment } from './Environment'

const IsMacOS = os.platform() === 'darwin'

const PostProcess = new BooleanEnvironment('IS_POST_PROCESS')
const KeychainCache = new StringEnvironment('KEYCHAIN')
const KeychainPasswordCache = new StringEnvironment('KEYCHAIN_PASSWORD')
const StoreGitCredential = new BooleanEnvironment('IS_STORE_GIT_CREDENTIAL')

async function SettingKeychain()
{
  core.startGroup('Keychain Settings')

  let keychain: string = core.getInput('keychain')
  if (!keychain) {
    keychain = Keychain.GetDefaultLoginKeychainPath()
    core.info('Use the default login keychain')
  } else {
    await Keychain.SetDefaultKeychain(keychain)
    await Keychain.SetListKeychain(keychain)
  }

  const keychainPassword: string = core.getInput('keychain-password')
  if (!!keychainPassword) {
    KeychainPasswordCache.Set(keychainPassword)
    core.setSecret(keychainPassword)
    await Keychain.UnlockKeychain(keychain, keychainPassword)
  }

  KeychainCache.Set(keychain)

  core.endGroup()
}

async function StoreCredential()
{
  await GitCredentialManager.Store(core.getInput('github-username'), core.getInput('github-password'))
  StoreGitCredential.Set(true)
}

async function Run()
{
  try {
    await GitCredentialManager.Configure()
    await GitCredentialManager.Setup()

    try {
      await GitCredentialManager.Get()
      core.notice('Authentication information is already set.')
    } catch (ex: any) {
      core.notice('No authentication information is set.')
      await SettingKeychain()
      await StoreCredential()
    }
  } catch (ex: any) {
    core.setFailed(ex.message)
  }

  PostProcess.Set(true)
}

async function Cleanup()
{
  try {
    if (!!StoreGitCredential.Get()) {
      await Keychain.SetDefaultKeychain(KeychainCache.Get())
      await Keychain.UnlockKeychain(KeychainCache.Get(), KeychainPasswordCache.Get())
      await GitCredentialManager.Erase()
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
}
