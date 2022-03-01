import * as exec from '@actions/exec'

export class Security
{
	static Execute(command, args)
	{
        args.unshift(command);
		return exec.exec('security', args);
	}

	static EnableKeychains(domain, path)
	{
		return this.Execute('list-keychains', [ '-d', domain, '-s', path ]);
	}

	static EnableUserKeychains(path)
	{
		return this.EnableKeychains('user', path);
	}

	static EnableSystemKeychains(path)
	{
		return this.EnableKeychains('system', path);
	}

	static EnableCommonKeychains(path)
	{
		return this.EnableKeychains('common', path);
	}

	static EnableDynamicKeychains(path)
	{
		return this.EnableKeychains('dynamic', path);
	}

	static EnableDefaultLoginKeychain()
	{
		return this.EnableUserKeychains(`${process.env.HOME}/Library/Keychains/login.keychain-db`);
	}

	static Unlock(path, password)
	{
		return this.Execute('unlock-keychain', [ '-p', `"${password}"`, path ]);
	}

	static AddGenericPassword(service, account, password)
	{
		return this.Execute('add-generic-password', [ '-a', account, '-s', service, '-w', password ]);
	}
}
