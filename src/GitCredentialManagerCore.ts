import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

export class GitCredentialManagerCore
{
	static async EnableLoginKeychain()
	{
		const args: string[] = [
			'list-keychains',
			'-d', 'user',
			'-s', `${process.env.HOME}/Library/Keychains/login.keychain-db`
		]

		await exec.exec('security', args)
	}

	static Execute(command: string, options?: ExecOptions)
	{
		return exec.exec('git', ['credential-manager-core', command], options)
	}

	static async Configure()
	{
		await this.Execute('configure')
		await exec.exec('git', ['config', '--global', 'credential.interactive', 'false'])
	}

	static async Get()
	{
		const options: exec.ExecOptions = {
			input: Buffer.from('protocol=https\nhost=github.com\n\n')
		}

		await this.EnableLoginKeychain()
		await this.Execute('get', options)
	};

	static async Store(username: string, password: string)
	{
		const options: exec.ExecOptions = {
			input: Buffer.from(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`)
		}

		await this.EnableLoginKeychain()
		await this.Execute('store', options)
	};	

	static async Erase()
	{
		const options: exec.ExecOptions = {
			input: Buffer.from('protocol=https\nhost=github.com\n')
		}

		await this.EnableLoginKeychain()
		await this.Execute('erase', options)
	};	
}
