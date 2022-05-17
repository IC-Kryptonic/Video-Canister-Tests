import { extname } from 'path';
import { exitWithError } from './error-handling';
import * as fs from 'fs';

export async function readFile(path: string): Promise<Buffer> {
  let file: Buffer = Buffer.from([0]);
  try {
    file = await fs.promises.readFile(path);
  } catch (error) {
    exitWithError('' + error);
  }
  return file;
}

export async function getFileSize(path: string): Promise<number> {
  let fileSize = 0;
  try {
    let stats: fs.Stats = await fs.promises.stat(path);
    fileSize = stats.size;
  } catch (error) {
    exitWithError('' + error);
  }
  return fileSize;
}

export function checkFileType(path: string) {
  const fileType = extname(path);
  if (fileType !== '.mp4') {
    exitWithError(`Error: Expected .mp4 file got ${fileType}`);
  }
}

export async function writeVideoToFile(path: string, buffer: Buffer) {
  try {
    await fs.promises.writeFile(path, buffer);
  } catch (error) {
    exitWithError('' + error);
  }
}
