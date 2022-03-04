export declare class Security {
    static LockKeychain(keychainPath?: string): Promise<number>;
    static LockKeychainAll(): Promise<number>;
    static UnlockKeychain(password: string, keychainPath: string): Promise<number>;
    static UnlockKeychain(password: string): Promise<number>;
    static CreateKeychain(keychainPath: string, password: string): Promise<number>;
    static DeleteKeychain(keychainPath: string): Promise<number>;
    static SetKeychain(keychain: string, keychainPath: string): Promise<number>;
    static SetDefaultKeychain(keychainPath: string): Promise<number>;
    static ShowDefaultKeychain(): Promise<number>;
    static SetLoginKeychain(keychainPath: string): Promise<number>;
    static ShowLoginKeychain(): Promise<number>;
    static ShowListKeychains(): Promise<number>;
    static SetListKeychains(keychainPath: string): Promise<number>;
    static FindGenericPassword(service: string): Promise<number>;
}
