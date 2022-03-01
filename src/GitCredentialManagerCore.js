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

	static GetDefaultExecOptions()
	{
		return {
			cwd: __dirname,
			env: {},
			silent: false,
			failOnStdErr: false,
			ignoreReturnCode: false
		}
	}
	static async Get()
	{
		const options = GetDefaultExecOptions();
		options.input = Buffer.from('protocol=https\nhost=github.com\n');

		await this.Execute('get', options);
	};

	static async Store(username, password)
	{
		const options = GetDefaultExecOptions();
		options.input = Buffer.from('protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n');

		await this.Execute('store', options);
	};	

	static async Erase()
	{
		const options = GetDefaultExecOptions();
		options.input = Buffer.from('protocol=https\nhost=github.com\n');

		await this.Execute('erase', options);
	};	
}
