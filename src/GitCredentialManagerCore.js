import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import { Git } from './Git';

export class GitCredentialManagerCore
{
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

	static GetInput()
	{
		return 'protocol=https\nhost=github.com\n';
	}

	static GetInput(username, password)
	{
		return 'protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n';
	}

	static async Execute(command, input)
	{
		const options = this.GetDefaultExecOptions();
		options.input = Buffer.from(input);

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
		await this.Execute('get', this.GetInput());
	};

	static async Store(username, password)
	{
		await this.Execute('store', this.GetInput(username, password));
	};	

	static async Erase()
	{
		await this.Execute('erase', this.GetInput());
	};	
}
