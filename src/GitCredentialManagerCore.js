import * as exec from '@actions/exec'

export class GitCredentialManagerCore
{
	static async EnableDefaultLoginKeychain()
	{
		await exec.exec('security', ['list-keychains', '-d', 'user', '-s', `${process.env.HOME}/Library/Keychains/login.keychain-db` ]);
	}

	static async Configure()
	{
		await exec.exec('git', ['credential-manager-core', 'configure']);
		await exec.exec('git', ['config', '--global', 'credential.interactive', 'false']);
	}

	static async Get()
	{
		await this.EnableDefaultLoginKeychain();
		await exec.exec('git' ['credential-manager-core', 'get'], { input: 'protocol=https\nhost=github.com\n\n' });
	};

	static async Store(username, password)
	{
		await this.EnableDefaultLoginKeychain();
		await exec.exec('git', ['credential-manager-core', 'store'], { input: `protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n` });
	};	

	static async Erase()
	{
		await this.EnableDefaultLoginKeychain();
		await exec.exec('git', ['credential-manager-core', 'erase'], { input: 'protocol=https\nhost=github.com\n' });
	};	
}
