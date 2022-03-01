import * as core from '@actions/core'
import * as exec from '@actions/exec'

export class Git
{
	static CreateProcess(command, input)
	{
		if (input === null) {
			return exec.exec('git', command);
		} else {
			return exec.exec('git', command, { input: Buffer.from(input) })
		}
	}
}
