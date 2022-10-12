import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

export class GitCredentialManagerCore
{
  static Execute(command: string, options?: ExecOptions): Promise<number>
  {
    // https://github.com/GitCredentialManager/git-credential-manager/blob/main/docs/credstores.md#macos-keychain
    return exec.exec('git', ['credential-manager-core', command], options)
  }

  static async Configure(): Promise<number>
  {
    await this.Execute('configure')
    return exec.exec('git', ['config', '--global', 'credential.interactive', 'false'])
  }

  static Get(): Promise<number>
  {
    const options: exec.ExecOptions = {
      input: Buffer.from(`protocol=https\nhost=github.com\n\n`),
    }

    return this.Execute('get', options)
  }

  static async GetWithStdout(): Promise<string>
  {
    let output = ''
    const options: exec.ExecOptions = {
      input: Buffer.from(`protocol=https\nhost=github.com\n\n`),
      listeners: {
        stdout (data: Buffer) {
          output += data.toString()
        } 
      }
    }

    try {
      await this.Execute('get', options)
      return output;
    } catch (ex: any) {
      return ''
    }
  }

  /**
   * Store git credentials
   * 
   * @param   username        User name.
   * @param   password        Password or Personal access token.
   * @returns Promise<number> exit code
   */
  static Store(username: string, password: string): Promise<number>
  {
    const options: exec.ExecOptions = {
      input: Buffer.from(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n\n`)
    }

    return this.Execute('store', options)
  }

  /**
   * Erase git credentials
   * 
   * @returns Promise<number> exit code
   */
  static Erase(): Promise<number>
  {
    const options: exec.ExecOptions = {
      input: Buffer.from(`protocol=https\nhost=github.com\n\n`),
    }

    return this.Execute('erase', options)
  }
}
