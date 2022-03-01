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
		const process = this.Execute('get');
		process.stdin.write('protocol=https');
		process.stdin.write('host=github.com');
		process.stdin.end();
		await process;
	};

	static async Store(username, password)
	{
		const process = this.Execute('store');
		process.stdin.write('protocol=https');
		process.stdin.write('host=github.com');
		process.stdin.write(`username=${username}`);
		process.stdin.write(`password=${password}`);
		process.stdin.end();
		await process;
	};	

	static async Erase()
	{
		const process = this.Execute('erase');
		process.stdin.write('protocol=https');
		process.stdin.write('host=github.com');
		process.stdin.end();
		await process;
	};	
}
