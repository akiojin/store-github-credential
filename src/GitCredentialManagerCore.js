import * as exec from '@actions/exec'
import { Security } from './Security'

export class GitCredentialManagerCore
{
	static async Configure()
	{
		await exec.exec('git', ['credential-manager-core', 'configure']);
		await exec.exec('git', ['config', '--global', 'credential.interactive', 'false']);
	}

	static async Get()
	{
		await Security.EnableDefaultLoginKeychain();
		await exec.exec('git' ['credential-manager-core', 'get'], { input: 'protocol=https\nhost=github.com\n\n' });
	};

	static async Store(username, password)
	{
		await Security.EnableDefaultLoginKeychain();
		await exec.exec('git', ['credential-manager-core', 'store'], { input: `protocol=https\nhost=github.com\nusername=${username}\npassword=${password}\n` });
	};	

	static async Erase()
	{
		await Security.EnableDefaultLoginKeychain();
		await exec.exec('git', ['credential-manager-core', 'erase'], { input: 'protocol=https\nhost=github.com\n' });
	};	
}
