import * as exec from '@actions/exec'

export class Security
{
	static Execute(command, args)
	{
        args.unshift(command);
		return exec.exec('security', args);
	}

	static async EnableKeychains(domain, path)
	{
		await this.Execute('list-keychains', [ '-d', domain, '-s', path ]);
	}

	static async EnableUserKeychains(path)
	{
		await this.EnableKeychains("user", path);
	}

	static async EnableSystemKeychains(path)
	{
		await this.EnableKeychains("system", path);
	}

	static async EnableCommonKeychains(path)
	{
		await this.EnableKeychains("common", path);
	}

	static async EnableDynamicKeychains(path)
	{
		await this.EnableKeychains("dynamic", path);
	}

	static async EnableDefaultLoginKeychain()
	{
		await this.EnableUserKeychains(`${process.env.HOME}/Library/Keychains/login.keychain-db`);
	}

	static Unlock(path, password)
	{
		return this.Execute('unlock-keychain', [ '-p', `"${password}"`, path ]);
	}

	static async AddGenericPassword(service, account, password)
	{
		await this.Execute('add-generic-password', [ '-a', account, '-s', service, '-w', password ]);
	}
}
