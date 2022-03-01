import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import { Git } from './Git';

export class GitCredentialManagerCore
{
	static async Execute(command, options)
	{
		await Git.Execute(['credential-manager-core', command], options);
	}

	static async Execute(command)
	{
		await Git.Execute(['credential-manager-core', command]);
	}

	static async Configure()
	{
		process.env['GIT_TRACE'] = '1';
		process.env['GCM_TRACE_SECRETS'] = '1'

		await this.Execute('configure');
		await Git.Execute(['config', '--global', 'credential.interactive', 'false']);
	}

	static async Get()
	{
		const options = {
			input: Buffer.from('protocol=https\nhost=github.com\n')
		}

		await this.Execute('get', options);
	};

	static async Store(username, password)
	{
		const options = {
			input: Buffer.from('protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n')
		}

		await this.Execute('store', options);
	};	

	static async Erase()
	{
		const options = {
			input: Buffer.from('protocol=https\nhost=github.com\n')
		}

		await this.Execute('erase', options);
	};	
}
