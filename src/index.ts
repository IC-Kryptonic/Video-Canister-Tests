import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import { basename, extname } from 'path';

const optionDefinitions = [{ name: 'video', alias: 'v', type: String }];

const options = commandLineArgs(optionDefinitions);

function exitWithError(error: string) {
  console.error(error);
  process.exit(-1);
}

async function readFile(path: string): Promise<Buffer> {
  let file: Buffer = Buffer.from([0]);
  try {
    file = await fs.promises.readFile(path);
  } catch (error) {
    exitWithError(error.toString());
  }
  return file;
}

async function getFileSize(path: string): Promise<number> {
  let fileSize = 0;
  try {
    let stats: fs.Stats = await fs.promises.stat(path);
    fileSize = stats.size;
  } catch (error) {
    exitWithError(error.toString());
  }
  return fileSize;
}

function checkFileType(path: string) {
  const fileType = extname(path);
  if (fileType !== '.mp4') {
    exitWithError(`Error: Expected .mp4 file got ${fileType}`);
  }
}

if (!options.video) {
  exitWithError(`Error: Please provide the video file for the cost test like this: \nindex.ts -v video_name.mp4`);
}

async function testCosts() {
  const { video } = options;
  const costProperties: CostProperties = {};

  const file = await readFile(video);
  costProperties.fileSize = await getFileSize(video);
  costProperties.fileName = basename(video);
  checkFileType(video);
}

testCosts();
