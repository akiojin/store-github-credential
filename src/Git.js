import * as execa from 'execa'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

export class Git
{
	static async Execute(args, options)
	{
		await execa.execa('git', args, options);
	}

	static async Execute(args)
	{
		await execa.execa('git', args);
	}
}
