export declare class GitCredentialManagerCore {
    static EnableDefaultLoginKeychain(): Promise<void>;
    static Configure(): Promise<void>;
    static Get(): Promise<void>;
    static Store(username: string, password: string): Promise<void>;
    static Erase(): Promise<void>;
}
