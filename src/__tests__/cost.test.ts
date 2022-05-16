import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { Principal } from '@dfinity/principal';
import { identityBronte } from '../../identities/identities';
import wallets from '../../.dfx/local/wallets.json';
import { readFile } from '../util/file-parsing';

jest.setTimeout(300_000);

describe('cost testing to estimate how many cycles are burned for ', () => {
  let localWallet: Principal;
  try {
    localWallet = Principal.fromText(wallets.identities.moritz.local);
  } catch (error) {
    console.error('You need to create a local wallet for this test first');
    process.exit(-1);
  }

  const chunkSize = 2000000;
  const cyclesPerByteUpload = 805;
  const cyclesPerByteDownload = 85;

  const storageConfig: StorageConfig = {
    spawnCanisterPrincipalId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    indexCanisterPrincipalId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
    storeOnIndex: true,
    chunkSize,
    host: "http://127.0.0.1:8000",
    uploadAttemptsPerChunk: 5,
  };

  const storage = new ICVideoStorage(storageConfig);

  let uploadedVideoPrincipal: Principal;
  let video: VideoToStore;
  let file: Buffer;

  test('uploads a video to a new canister', async () => {
    file = await readFile('./videos/long-long-video.mp4');

    video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };

    const oldEstimatedCycles = BigInt(
      // cost for canister creation
      100_000_000_000 +
        // cost for video upload
        Buffer.byteLength(file) * cyclesPerByteUpload +
        // cost for 100 video downloads / watches
        100 * cyclesPerByteDownload +
        // spawn canister fee
        600_000_000 +
        // cost for freezing threshold
        20_810_551_622,
    );
    // const estimatedCycles = BigInt(2300 * Buffer.byteLength(file) + 100_000_000_000);
    const estimatedCycles = BigInt(2300 * Buffer.byteLength(file));
    console.log('estimatedCycles', estimatedCycles.toString());
    console.log('file size in bytes', Buffer.byteLength(file));

    const minCycles = BigInt(200_000_000_000);
    const usedCycles = estimatedCycles < minCycles ? minCycles : estimatedCycles;

    uploadedVideoPrincipal = await storage.uploadVideo({
      identity: identityBronte,
      walletId: localWallet,
      video: video,
      cycles: usedCycles,
    });

    console.log(uploadedVideoPrincipal.toText());

    await storage.changeOwner({
      oldIdentity: identityBronte,
      oldWallet: localWallet,
      videoPrincipal: uploadedVideoPrincipal,
      newOwner: Principal.fromText('cad7y-ea435-4kr6n-w4mbi-ndchw-22wql-qfqjx-fwt3o-g7ozu-mkio2-oqe'),
      newOwnerWallet: localWallet,
    });

    // this fails if the returned principal does not have a valid syntax
    Principal.fromText(uploadedVideoPrincipal.toText());
  });

  test.skip('change bytes in existing video canister', async () => {
    file = await readFile('./videos/video.mp4');
    const chunkSlice = file.slice(0, chunkSize);
    console.log(Buffer.byteLength(chunkSlice));
    const chunkArray = Array.from(chunkSlice);
    const chunksAsVector = chunkArray.join(':nat8; ') + ':nat8;';
    console.log(
      `dfx canister --wallet zkijs-dqaaa-aaaaa-aabuq-cai call ${uploadedVideoPrincipal} put_chunk '(${0}:nat64, vec { ${chunksAsVector} })'`,
    );
  });
});
