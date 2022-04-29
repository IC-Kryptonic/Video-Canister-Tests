import { ICVideoStorage } from '../../Video-Canister/src/video_canister_package/src/index';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { identityBronte, walletPrincipalId } from '../identities/identities';
import { Principal } from '@dfinity/principal';
import { readFile } from './util/file-parsing';

const storageConfig: StorageConfig = {
  spawnCanisterPrincipal: 'fvyzl-oaaaa-aaaal-qaxvq-cai',
  indexCanisterPrincipal: 'fa7ig-piaaa-aaaal-qaxwa-cai',
  chunkSize: 100000,
};

async function testChainConnection() {
  const storage = new ICVideoStorage(storageConfig);
  console.log(await storage.getMyVideos(identityBronte));
}

async function testUpload() {
  const storage = new ICVideoStorage(storageConfig);

  const file = await readFile('./videos/video.mp4');

  const cycles = BigInt(200000000000);

  const walletId = Principal.fromText(walletPrincipalId);

  const video: VideoToStore = {
    name: 'My Favourite Video',
    description: 'Memories from 2021',
    videoBuffer: file,
  };

  const canisterPrincipal = await storage.uploadVideo(identityBronte, walletId, video, cycles);

  console.log(canisterPrincipal);
}

testChainConnection();
