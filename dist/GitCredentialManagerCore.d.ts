import { ExecOptions } from '@actions/exec';
export declare class GitCredentialManagerCore {
    static Execute(command: string, options?: ExecOptions): Promise<number>;
    static Configure(): Promise<number>;
    static Get(): Promise<string>;
    static Store(username: string, password: string): Promise<number>;
    static Erase(): Promise<number>;
}
