import * as execa from 'execa'

export class GitCredentialManagerCore
{	
	static async Get()
	{
		const process = execa.execa('git', ['credential-manager-core', 'get']);
		process.stdin.write('protocol=https\n');
		process.stdin.write('host=github.com\n');
		process.stdin.write(`\n`);
		process.stdin.end();
		await process;
	};

	static async Store(username, password)
	{
		const process = execa.execa('git', ['credential-manager-core', 'store']);
		process.stdin.write('protocol=https\n');
		process.stdin.write('host=github.com\n');
		process.stdin.write(`username=${username}\n`);
		process.stdin.write(`password=${password}\n`);
		process.stdin.end();
		await process;
	};	

	static async Erase()
	{
		const process = execa.execa('git', ['credential-manager-core', 'erase']);
		process.stdin.write('protocol=https\n');
		process.stdin.write('host=github.com\n');
		process.stdin.end();
		await process;
	};	
}
