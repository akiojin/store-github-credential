export declare class Security {
    static Lock(keychainPath?: string): Promise<number>;
    static LockAll(): Promise<number>;
    static Unlock(password: string, keychainPath: string): Promise<number>;
    static ListKeychains(keychainPath: string): Promise<number>;
}
