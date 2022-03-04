import * as exec from '@actions/exec'

export class Security
{
	static Lock(keychainPath?: string): Promise<number>
	{
		if (keychainPath == null) {
			return exec.exec('security', ['lock-keychain'])
		} else {
			return exec.exec('security', ['lock-keychain', keychainPath])
		}
	}

	static LockAll(): Promise<number>
	{
		return exec.exec('security', ['lock-keychain', '-a'])
	}

	static Unlock(password: string, keychainPath: string): Promise<number>
	static Unlock(password: string): Promise<number>
	static Unlock(password: string, keychainPath?: string): Promise<number>
	{
		if (keychainPath != null) {
			return exec.exec('security', ['unlock-keychain', '-p', `"${password}"`, keychainPath])
		} else {
			return exec.exec('security', ['unlock-keychain', '-p', `"${password}"`])
		}
	}

	static ShowDefaultKeychain(): Promise<number>
	{
		return exec.exec('security', ['default-keychain'])
	}

	static ShowLoginKeychain(): Promise<number>
	{
		return exec.exec('security', ['login-keychain'])
	}

	static ShowListKeychains(): Promise<number>
	{
		return exec.exec('security', ['list-keychains', '-d', 'user'])
	}

	static ListKeychains(keychainPath: string): Promise<number>
	{
		return exec.exec('security', ['list-keychains', '-d', 'user', '-s', keychainPath])
	}

	static FindGenericPassword(service: string)
	{
		return exec.exec('security', ['find-generic-password', '-s', service])
	}
}
