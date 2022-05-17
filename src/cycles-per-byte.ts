import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig } from 'ic-video-storage/build/interfaces';
import { identityBronte } from '../identities/identities';
import { readFile } from './util/file-parsing';
import wallets from '../.dfx/local/wallets.json';
import { Principal } from '@dfinity/principal';
import { writeToFile } from './util/write-result-to-file';

// formula for calculating costs
// cycles = 190_000_000_000 + 1500 * fileSize

const fileSizes = [30000000, 64000000, 128000000];
const totalCycles = [
  250000000000, 300000000000, 350000000000, 400000000000, 450000000000, 500000000000, 550000000000, 600000000000,
  650000000000, 700000000000, 750000000000, 800000000000, 850000000000, 900000000000, 950000000000, 1000000000000,
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
  const localWallet = Principal.fromText(wallets.identities.default.local);
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

async function writeCoordinate(index: number, cycles: number, bytes: number) {
  var str = '';
  let char = String.fromCharCode(65 + index);
  str += char + '';
  await writeToFile(`${str} = (${bytes / 100000}, ${cycles / 1000000000})`);
}

async function cyclesToCoordinates() {
  await writeToFile(`###`);
  await writeToFile(`New coordinate tests for chunkSize: ${chunkSize}`);
  await writeToFile(`Format: A = (10, 25); A: index of test, 10: bytes / 100_000, 25: cycles / 1_000_000_000`);
  const localWallet = Principal.fromText(wallets.identities.default.local);
  let lastValidCycles = 200000000000;
  for (let i = 0; i <= 26; i++) {
    const fileSize = 40000000 + 2000000 * i;
    await writeToFile(`### fileSize: ${fileSize}`);
    const file = (await readFile('./videos/long-long-video.mp4')).slice(0, fileSize);
    const video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };
    for (let j = 0; j < 20; j++) {
      try {
        await storage.uploadVideo({
          identity: identityBronte,
          walletId: localWallet,
          video: video,
          cycles: BigInt(lastValidCycles),
        });
        await writeCoordinate(i, lastValidCycles, fileSize);

        break;
      } catch (error) {
        lastValidCycles += 20000000000;
      }
    }
  }
}

async function estimatedCycles() {
  await writeToFile(`###`);
  await writeToFile(`New tests for estimatedCycles function for chunkSize: ${chunkSize}`);
  const localWallet = Principal.fromText(wallets.identities.default.local);
  for (let i = 0; i <= 26; i++) {
    const fileSize = 10000000 + 5000000 * i;
    await writeToFile(`### fileSize: ${fileSize}`);
    const file = (await readFile('./videos/long-long-video.mp4')).slice(0, fileSize);
    const video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };
    try {
      const cycles = storage.calculateCycleEstimate(file.byteLength);
      await storage.uploadVideo({
        identity: identityBronte,
        walletId: localWallet,
        video: video,
        cycles,
      });
      await writeToFile(`Estimated cycles for upload: ${cycles}`);
      await writeToFile(`Upload successful for ${cycles} cycles`);
    } catch (error) {
      await writeToFile(`Error: Upload failed for estimated cycles`);
    }
  }
}

async function runTests() {
  await estimatedCycles();
}

runTests();
