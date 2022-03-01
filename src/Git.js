import * as execa from 'execa'
import * as exec from '@actions/exec'

export class Git
{
	static CreateProcess(command)
	{
		return execa.execa('git', command);
	}
}
