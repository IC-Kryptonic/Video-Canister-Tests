import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { identityBronte, walletPrincipalId } from '../identities/identities';
import { Principal } from '@dfinity/principal';
import { readFile } from './util/file-parsing';
import * as fs from 'fs';

const storageConfig: StorageConfig = {
  spawnCanisterPrincipal: 'fvyzl-oaaaa-aaaal-qaxvq-cai',
  indexCanisterPrincipal: 'fa7ig-piaaa-aaaal-qaxwa-cai',
  chunkSize: 100000,
};

async function testChainConnection() {
  const storage = new ICVideoStorage(storageConfig);
  console.log(await storage.getMyVideos(identityBronte));
}

async function testDownloadLatestVideo() {
  const storage = new ICVideoStorage(storageConfig);
  const videoPrincipals: Array<Principal> = await storage.getMyVideos(identityBronte);
  if (videoPrincipals.length > 0) {
    const videoPrincipal = videoPrincipals[videoPrincipals.length - 1];
    const video = await storage.getVideo(identityBronte, videoPrincipal);
    console.log(video);
    try {
      await fs.promises.writeFile('yollah.mp4', video.videoBuffer);
    } catch (error) {
      console.error(error);
    }
  }
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

testDownloadLatestVideo();
