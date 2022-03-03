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

	static ListKeychains(): Promise<number>
	static ListKeychains(keychainPath?: string): Promise<number>
	static ListKeychains(keychainPath?: string): Promise<number>
	{
		if (keychainPath != null) {
			return exec.exec('security', ['list-keychains', '-d', 'user', '-s', keychainPath])
		} else {
			return exec.exec('security', ['list-keychains', '-d', 'user'])
		}
	}
}
