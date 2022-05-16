import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig } from 'ic-video-storage/build/interfaces';
import { identityBronte } from '../identities/identities';
import { readFile } from './util/file-parsing';
import wallets from '../.dfx/local/wallets.json';
import { Principal } from '@dfinity/principal';
import { writeToFile } from './util/write-result-to-file';

const fileSizes = [32000000, 64000000, 128000000, 200000000];
const totalCycles = [
  200000000000, 250000000000, 300000000000, 350000000000, 400000000000, 450000000000, 500000000000, 550000000000,
  600000000000, 650000000000, 700000000000, 750000000000, 800000000000, 850000000000, 900000000000, 950000000000,
  1000000000000,
];

const chunkSize = 1000000;
const storageConfig: StorageConfig = {
  spawnCanisterPrincipalId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  indexCanisterPrincipalId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
  storeOnIndex: true,
  chunkSize,
  host: 'http://127.0.0.1:8000',
  uploadAttemptsPerChunk: 5,
};

const storage = new ICVideoStorage(storageConfig);

async function testCyclesPerByteForFileSizes() {
  await writeToFile(`###`);
  await writeToFile(`New tests for chunkSize: ${chunkSize}`);
  const localWallet = Principal.fromText(wallets.identities.moritz.local);
  for (let fileSize of fileSizes) {
    await writeToFile(`### fileSize: ${fileSize}`);
    const file = (await readFile('./videos/long-long-video.mp4')).slice(0, fileSize);
    const video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };
    for (let cycles of totalCycles) {
      try {
        await storage.uploadVideo({
          identity: identityBronte,
          walletId: localWallet,
          video: video,
          cycles: BigInt(cycles),
        });
        await writeToFile(`Upload successful for ${cycles} cycles`);
        break;
      } catch (error) {
        await writeToFile(`Error: Upload failed for ${cycles} cycles`);
      }
    }
  }
}

async function runTests() {
  await testCyclesPerByteForFileSizes();
}

runTests();
