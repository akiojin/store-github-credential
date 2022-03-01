import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

export class Git
{
	static Execute(command)
	{
		return execa.execa('git', command);
	}
}
