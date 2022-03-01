import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import { Git } from './Git';

export class GitCredentialManagerCore
{
	static CreateGitCredentialProcess(command)
	{
		return Git.CreateProcess(['credential-manager-core', command]);
	}

	static async Configure()
	{
		process.env['GIT_TRACE'] = '1';
		process.env['GCM_TRACE_SECRETS'] = '1'

		await this.CreateGitCredentialProcess('configure');
		await Git.CreateProcess(['config', '--global', 'credential.interactive', 'false']);
	}

	static async Get()
	{
		const credential = this.CreateGitCredentialProcess('get');
		credential.stdin.write('protocol=https\nhost=github.com\n\n');
		credential.stdin.end();
		await credential;
	};

	static async Store(username, password)
	{
		const credential = this.CreateGitCredentialProcess('store');
		credential.stdin.write(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`);
		credential.stdin.end();
		await credential;
	};	

	static async Erase()
	{
		const credential = this.CreateGitCredentialProcess('erase');
		credential.stdin.write('protocol=https\nhost=github.com\n');
		credential.stdin.end();
		await credential;
	};	
}
