import * as core from '@actions/core'
import * as fsPromises from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

export class FileSystem
{
	static GenerateTemporaryFilename()
	{
		const path = `${process.env.RUNNER_TEMP}/${uuidv4()}`;
		core.info(`path:${path}`);
		return path;
	};
	
	static async GetTemporaryFile(text)
	{
		const path = GenerateTemporaryFilename();
		await fsPromises.writeFile(path, text);
		return path;
	};
	
}
