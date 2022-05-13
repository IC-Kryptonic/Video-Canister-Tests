import { ICVideoStorage } from '../../Video-Canister/src/video_canister_package/src/index';
import { VideoToStore } from 'ic-video-storage/build/interfaces';
import { identityBronte, walletPrincipalId } from '../identities/identities';
import { Principal } from '@dfinity/principal';
import { readFile } from './util/file-parsing';
import { StorageConfig } from '../../Video-Canister/src/video_canister_package/src/interfaces';
import wallets from '../.dfx/local/wallets.json';

const storageConfig: StorageConfig = {
  spawnCanisterPrincipalId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  indexCanisterPrincipalId: 'fa7ig-piaaa-aaaal-qaxwa-cai',
  storeOnIndex: false,
  chunkSize: 1000000,
  host: 'http://127.0.0.1:8000',
};

async function testUpload() {
  const storage = new ICVideoStorage(storageConfig);

  const file = await readFile('./videos/video.mp4');

  const cycles = BigInt(200000000000);
  const walletId = Principal.fromText(wallets?.identities?.default?.local || '');

  const video: VideoToStore = {
    name: 'My Favourite Video',
    description: 'Memories from 2021',
    videoBuffer: file,
  };

  const canisterPrincipal = await storage.uploadVideo({
    identity: identityBronte,
    walletId: walletId,
    video,
    cycles,
  });

  console.log(canisterPrincipal.toText());
}

testUpload();
