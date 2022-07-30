/// <reference types="node" />
import { ExecOptions } from '@actions/exec';
export declare class GitCredentialManagerCore {
    static Execute(command: string, options?: ExecOptions): Promise<number>;
    static Configure(): Promise<number>;
    static CreateBuffer(protocol: string, host: string): Buffer;
    static Get(): Promise<string>;
    static Get2(): Promise<number>;
    /**
     * Store git credentials
     *
     * @param   username        User name.
     * @param   password        Password or Personal access token.
     * @returns Promise<number> exit code
     */
    static Store(username: string, password: string): Promise<number>;
    /**
     * Erase git credentials
     *
     * @returns Promise<number> exit code
     */
    static Erase(): Promise<number>;
}
