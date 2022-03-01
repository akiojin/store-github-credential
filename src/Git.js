import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class Git
{
	static CreateProcess(command)
	{
		core.notice('2');
		return exec.exec('git', command);
	}

	static CreateProcess(command, input)
	{
		core.notice('22');
		return exec.exec('git', command, { input: Buffer.from(input) })
	}
}
