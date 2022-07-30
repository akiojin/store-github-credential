/// <reference types="node" />
import { ExecOptions } from '@actions/exec';
export declare class GitCredentialManagerCore {
    static Execute(command: string, options?: ExecOptions): Promise<number>;
    static Configure(): Promise<number>;
    static CreateBuffer(protocol: string, host: string): Buffer;
    static Get(): Promise<string>;
    static Get2(): Promise<number>;
    static Store(username: string, password: string): Promise<number>;
    static Erase(): Promise<number>;
}
