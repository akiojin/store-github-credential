import { Git } from './Git';
import { Security } from './Security'

export class GitCredentialManagerCore
{
	static CreateGitCredentialProcess(command)
	{
		return Git.CreateProcess(['credential-manager-core', command]);
	}

	static async Configure()
	{
		await this.CreateGitCredentialProcess('configure');
		await Git.CreateProcess(['config', '--global', 'credential.interactive', 'false']);
	}

	static async Get()
	{
		await Security.EnableDefaultLoginKeychain();

		const credential = this.CreateGitCredentialProcess('get');
		credential.stdin.write('protocol=https\nhost=github.com\n\n');
		credential.stdin.end();
		await credential;
	};

	static async Store(username, password)
	{
		await Security.EnableDefaultLoginKeychain();

		const credential = this.CreateGitCredentialProcess('store');
		credential.stdin.write(`protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n`);
		credential.stdin.end();
		await credential;
	};	

	static async Erase()
	{
		await Security.EnableDefaultLoginKeychain();

		const credential = this.CreateGitCredentialProcess('erase');
		credential.stdin.write('protocol=https\nhost=github.com\n');
		credential.stdin.end();
		await credential;
	};	
}
