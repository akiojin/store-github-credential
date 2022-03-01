import * as execa from 'execa'
import * as exec from '@actions/exec'

export class GitCredentialManagerCore
{	
	static async Get()
	{
		const options = {
			input: Buffer.from(`protocol=https\nhost=github.com`)
		};

		await exec.exec('git', ['credential-manager-core', 'get'], options);
	};

	static async Store(username, password)
	{
		const options = {
			input: Buffer.from(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`)
		};

		await exec.exec('git', ['credential-manager-core', 'store'], options);
	};	

	static async Erase()
	{
		const options = {
			input: Buffer.from(`protocol=https\nhost=github.com`)
		};

		await exec.exec('git', ['credential-manager-core', 'erase'], options);
	};	
}
