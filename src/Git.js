import * as exec from '@actions/exec'

export class Git
{
	static CreateProcess(command)
	{
		return exec.exec('git', command);
	}

	static CreateProcessWithInput(command, input)
	{
		return exec.exec('git', command, { input: Buffer.from(input) })
	}
}
