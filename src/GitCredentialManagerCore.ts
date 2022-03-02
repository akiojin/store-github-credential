import * as exec from '@actions/exec'

export class GitCredentialManagerCore
{
	static async EnableDefaultLoginKeychain()
	{
		const args: string[] = [
			'list-keychains',
			'-d', 'user',
			'-s', `${process.env.HOME}/Library/Keychains/login.keychain-db`
		]

		await exec.exec('security', args)
	}

	static async Configure()
	{
		await exec.exec('git', ['credential-manager-core', 'configure'])
		await exec.exec('git', ['config', '--global', 'credential.interactive', 'false'])
	}

	static async Get()
	{
		const args: string[] = [
			'credential-manager-core',
			'get'
		]

		const options: exec.ExecOptions = {
			input: Buffer.from('protocol=https\nhost=github.com\n\n')
		}

		await this.EnableDefaultLoginKeychain()
		await exec.exec('git', args, options)
	};

	static async Store(username: string, password: string)
	{
		const args: string[] = [
			'credential-manager-core',
			'store'
		]

		const options: exec.ExecOptions = {
			input: Buffer.from(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`)
		}

		await this.EnableDefaultLoginKeychain()
		await exec.exec('git', args, options)
	};	

	static async Erase()
	{
		const args: string[] = [
			'credential-manager-core',
			'erase'
		]

		const options: exec.ExecOptions = {
			input: Buffer.from('protocol=https\nhost=github.com\n')
		}

		await this.EnableDefaultLoginKeychain()
		await exec.exec('git', args, options)
	};	
}
