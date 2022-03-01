import * as execa from 'execa'
import * as exec from '@actions/exec'

export class Git
{
	static Execute(command)
	{
		return execa.execa('git', command);
	}
}
