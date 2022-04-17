import commandLineArgs from 'command-line-args';
import * as fs from 'fs';
import { basename, extname } from 'path';
// TODO import from actual npm package when it's published
import { getVideo, uploadVideo } from '../../Video-Canister/src/video_canister_package/src/index';
import { CostProperties, Metadata } from './interfaces';
import { testPutMetadata, testReadMetadata, testUploadVideo } from './test-processes';
import { getCanisterBalance, getWalletBalance, uploadUserVideo } from './util/dfx-commands';
import { exitWithError } from './util/error-handling';

export const CHUNK_SIZE = 100000;
const optionDefinitions = [
  { name: 'video', alias: 'v', type: String },
  { name: 'principal', alias: 'p', type: String },
];
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

if (!options.video || !options.principal) {
  exitWithError(
    `Error: Please provide the video file for the cost test like this: \nindex.ts -v video_name.mp4 -p 6ccli-2qaaa-aaaal-qavgq-cai`,
  );
}

async function testCosts() {
  const { video, principal } = options;
  const costProperties: CostProperties = {};

  const file = await readFile(video);
  costProperties.fileName = basename(video);
  costProperties.fileSize = await getFileSize(video);
  checkFileType(video);
  // costProperties.initialWalletCycles = await getWalletBalance();
  costProperties.fileChunkNum = Math.ceil(costProperties.fileSize / CHUNK_SIZE);

  const metadata: Metadata = {
    name: costProperties.fileName,
    description: '' + costProperties.fileSize,
    chunk_num: costProperties.fileChunkNum,
  };

  // await testPutMetadata(principal, metadata, costProperties);
  // await testReadMetadata(principal, costProperties);
  await testUploadVideo(principal, file, costProperties);
  //console.log(costProperties);
  //console.log(await getCanisterBalance('6ccli-2qaaa-aaaal-qavgq-cai'));
}

testCosts();
