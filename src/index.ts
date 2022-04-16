import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import { basename, extname } from 'path';
// TODO import from actual npm package when it's published
import { getVideo, uploadVideo } from '../../Video-Canister/src/video_canister_package/src/index';
import { CostProperties } from './interfaces';
import { getWalletBalance } from './util/dfx-commands';
import { exitWithError } from './util/error-handling';

const optionDefinitions = [{ name: 'video', alias: 'v', type: String }];

const options = commandLineArgs(optionDefinitions);

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
  costProperties.fileName = basename(video);
  costProperties.fileSize = await getFileSize(video);
  checkFileType(video);
  costProperties.initialWalletCycles = await getWalletBalance();
  console.log(costProperties);
}

testCosts();
