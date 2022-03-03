import { ExecOptions } from '@actions/exec';
export declare class GitCredentialManagerCore {
    static EnableLoginKeychain(): Promise<void>;
    static Execute(command: string, options?: ExecOptions): Promise<number>;
    static Configure(): Promise<void>;
    static Get(): Promise<void>;
    static Store(username: string, password: string): Promise<void>;
    static Erase(): Promise<void>;
}
