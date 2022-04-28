import commandLineArgs from 'command-line-args';
import { basename } from 'path';
import { CostProperties, Metadata } from './interfaces';
import { testDownloadVideo, testPutMetadata, testReadMetadata, testUploadVideo } from './test-processes';
import { exitWithError } from './util/error-handling';
import { readFile, getFileSize, checkFileType } from './util/file-parsing';
import { writeToFile } from './util/write-result-to-file';

export const CHUNK_SIZE = 100000;
const optionDefinitions = [
  { name: 'video', alias: 'v', type: String },
  { name: 'principal', alias: 'p', type: String },
];
const options = commandLineArgs(optionDefinitions);

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

  writeToFile(
    `\n###############################################################` +
      `\nNEW TEST RUN FOR VIDEO: \nVideo name: ${metadata.name}\nFile size: ${metadata.description} \nNumber of chunks: ${metadata.chunk_num}\n`,
  );

  await testPutMetadata(principal, metadata, costProperties);
  await testReadMetadata(principal, costProperties);
  await testUploadVideo(principal, file, costProperties);
  await testDownloadVideo(principal, costProperties);

  writeToFile('###############################################################');
}

testCosts();
