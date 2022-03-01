import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import { Git } from './Git';

export class GitCredentialManagerCore
{
	static Execute(command)
	{
		return Git.Execute(['credential-manager-core', command]);
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
		await execa.execa('echo "protocol=https\nhost=github.com\n"').pipe('git credential-manager-core get');
	};

	static async Store(username, password)
	{
		await execa.execa(`echo "protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n"`).pipe('git credential-manager-core store');
	};	

	static async Erase()
	{
		await execa.execa('echo "protocol=https\nhost=github.com\n"').pipe('git credential-manager-core erase');
	};	
}
