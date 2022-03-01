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

	static GetEcho(command)
	{
		return execa.execa('echo', [command]);
	}

	static GetCredential(command)
	{
		return execa.execa('git', ['credential-manager-core', 'command']);
	}

	static async Wait(echo, credential)
	{
		echo.stdout.pipe(credential.stdin);
		const { stdout } = await credential;
		core.info(`stdout: ${stdout}`);
	}

	static async Get()
	{
		const echo = this.GetEcho('protocol=https\nhost=github.com\n');
		const credential = this.GetCredential('get');
		await this.Wait(echo, credential);
	};

	static async Store(username, password)
	{
		const echo = this.GetEcho(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`);
		const credential = this.GetCredential('store');
		await this.Wait(echo, credential);
	};	

	static async Erase()
	{
		const echo = this.GetEcho('protocol=https\nhost=github.com\n');
		const credential = this.GetCredential('erase');
		await this.Wait(echo, credential);
	};	
}
