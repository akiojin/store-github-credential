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

	static async Wait(echo, credential)
	{
		echo.stdout.pipe(credential.stdin);
		const r1 = await echo;
		core.info(`Echo stdout: ${JSON.stringify(r1)}`);

		const r2 = await credential;
		core.info(`Git Result: ${r2}`);
	}

	static async Get()
	{
		const echo = execa.execa('echo', '"protocol=https\\nhost=github.com\\n"');
		const credential = this.Execute('get');
		await this.Wait(echo, credential);
	};

	static async Store(username, password)
	{
		const echo = execa.execa('echo', `"protocol=https\\nhost=github.com\\nusername=${username}\\npassword=${password}\\n"`);
		const credential = this.Execute('store');
		await this.Wait(echo, credential);
	};	

	static async Erase()
	{
		const echo = execa.execa('echo', '"protocol=https\\nhost=github.com\\n"');
		const credential = this.Execute('erase');
		await this.Wait(echo, credential);
	};	
}
