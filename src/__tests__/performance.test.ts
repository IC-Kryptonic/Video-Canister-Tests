import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { Principal } from '@dfinity/principal';
import { identityBronte } from '../../identities/identities';
import wallets from '../../.dfx/local/wallets.json';
import { readFile } from '../util/file-parsing';

jest.setTimeout(600_000);

const chunkSizes = [20000, 40000, 80000, 160000, 240000, 480000, 960000, 1000000, 2000000];

describe('performance testing to evaluate a valid value range for chunk sizes', () => {
  let localWallet: Principal;
  try {
    localWallet = Principal.fromText(wallets.identities.default.local);
  } catch (error) {
    console.error('You need to create a local wallet for this test first');
    process.exit(-1);
  }

  let uploadedVideoPrincipal: Principal;
  let video: VideoToStore;
  let file: Buffer;

  test('uploads a video to a new canister', async () => {
    file = await readFile('./videos/video.mp4');

    video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };

    for (let chunkSize of chunkSizes) {
      try {
        const storageConfig: StorageConfig = {
          spawnCanisterPrincipalId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
          indexCanisterPrincipalId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
          storeOnIndex: true,
          chunkSize: chunkSize,
          host: 'http://127.0.0.1:8000',
          uploadAttemptsPerChunk: 3,
        };

        const storage = new ICVideoStorage(storageConfig);

        // suppress error messages in jest console output
        console.error = jest.fn();
        const startTime = Date.now();
        uploadedVideoPrincipal = await storage.uploadVideo({
          identity: identityBronte,
          walletId: localWallet,
          video: video,
          cycles: BigInt(250000000000),
        });
        const endTime = Date.now();
        console.log(`Upload successful for chunk size ${chunkSize} in ${(endTime - startTime) / 1000} seconds`);
      } catch (error) {
        console.log(`Upload failed for chunk size ${chunkSize}`, String(error));
      }
    }

    // this fails if the returned principal does not have a valid syntax
    Principal.fromText(uploadedVideoPrincipal.toText());
  });
});
