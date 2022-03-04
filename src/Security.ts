import * as exec from '@actions/exec'

export class Security
{
	static LockKeychain(keychainPath?: string): Promise<number>
	{
		if (keychainPath == null) {
			return exec.exec('security', ['lock-keychain'])
		} else {
			return exec.exec('security', ['lock-keychain', keychainPath])
		}
	}

	static LockKeychainAll(): Promise<number>
	{
		return exec.exec('security', ['lock-keychain', '-a'])
	}

	static UnlockKeychain(password: string, keychainPath: string): Promise<number>
	static UnlockKeychain(password: string): Promise<number>
	static UnlockKeychain(password: string, keychainPath?: string): Promise<number>
	{
		if (keychainPath != null) {
			return exec.exec('security', ['unlock-keychain', '-p', `"${password}"`, keychainPath])
		} else {
			return exec.exec('security', ['unlock-keychain', '-p', `"${password}"`])
		}
	}

	static CreateKeychain(keychainPath: string, password: string): Promise<number>
	{
		return exec.exec('security', ['create-keychain', '-p', password, keychainPath])
	}

	static DeleteKeychain(keychainPath: string): Promise<number>
	{
		return exec.exec('security', ['delete-keychain', keychainPath])
	}

	static SetKeychain(keychain: string, keychainPath: string): Promise<number>
	{
		return exec.exec('security', [keychain, '-d', 'user', '-s', keychainPath])
	}

	static SetDefaultKeychain(keychainPath: string): Promise<number>
	{
		return this.SetKeychain('default-keychain', keychainPath)
	}

	static ShowDefaultKeychain(): Promise<number>
	{
		return exec.exec('security', ['default-keychain'])
	}

	static SetLoginKeychain(keychainPath: string): Promise<number>
	{
		return this.SetKeychain('login-keychain', keychainPath)
	}

	static ShowLoginKeychain(): Promise<number>
	{
		return exec.exec('security', ['login-keychain'])
	}

	static ShowListKeychains(): Promise<number>
	{
		return exec.exec('security', ['list-keychains', '-d', 'user'])
	}

	static SetListKeychains(keychainPath: string): Promise<number>
	{
		return exec.exec('security', ['list-keychains', '-d', 'user', '-s', keychainPath])
	}

	static FindGenericPassword(service: string)
	{
		return exec.exec('security', ['find-generic-password', '-s', service])
	}
}
