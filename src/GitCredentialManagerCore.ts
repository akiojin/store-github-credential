import * as exec from '@actions/exec'
import { ExecOptions } from '@actions/exec'

export class GitCredentialManagerCore
{
	static Execute(command: string, options?: ExecOptions): Promise<number>
	{
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
			input: Buffer.from('protocol=https\nhost=github.com\n\n')
		}

		return this.Execute('get', options)
	};

	static Store(username: string, password: string): Promise<number>
	{
		const options: exec.ExecOptions = {
			input: Buffer.from(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`)
		}

		return this.Execute('store', options)
	};	

	static Erase(): Promise<number>
	{
		const options: exec.ExecOptions = {
			input: Buffer.from('protocol=https\nhost=github.com\n')
		}

		return this.Execute('erase', options)
	};	
}
