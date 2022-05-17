import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { identityBronte, identityMary } from '../identities/identities';
import { readFile, writeVideoToFile } from './util/file-parsing';
import { Principal } from '@dfinity/principal';

// ic wallet
const walletString = '6cgjb-xaaaa-aaaag-aae6q-cai';
const walletId = Principal.fromText(walletString);

const chunkSize = 100000;

// config for storage
const storageConfig: StorageConfig = {
  chunkSize,
  uploadAttemptsPerChunk: 3,
  spawnCanisterPrincipalId: '3j2ht-uqaaa-aaaag-aaioq-cai',
  indexCanisterPrincipalId: '3azmp-cyaaa-aaaag-aaipa-cai',
  storeOnIndex: true,
  host: 'https://ic0.app',
};

// initialize storage object
const storage = new ICVideoStorage(storageConfig);

async function runDemo() {
  //   await demoUploadVideo();
  //   await checkIndex();
  //   await downloadVideo();
  //   await changeTitleDescription();
  //   await changeOwnerMary();
  //   await changeVideo();
}

async function demoUploadVideo() {
  // read exemplary video file from disk
  const file = await readFile('./videos/demo-video.mp4');

  // create video object
  const video: VideoToStore = {
    name: 'Grant Demo Video',
    description: 'Memories from 2021',
    videoBuffer: file,
  };

  // estimate cycles required for canister creation and video upload
  const cycles = storage.calculateCycleEstimate(file.byteLength);

  // create canister and upload video
  const uploadedVideoPrincipal: Principal = await storage.uploadVideo({
    identity: identityBronte,
    walletId,
    video: video,
    cycles: cycles,
  });

  console.log('uploadedVideoPrincipal', uploadedVideoPrincipal.toText());
}

async function checkIndex() {
  const principals = await storage.getMyVideos(identityBronte);
  console.log(principals.map((principal) => principal.toText()));
}

async function downloadVideo() {
  // dfx canister --wallet 6cgjb-xaaaa-aaaag-aae6q-cai --network ic status 64cwk-jqaaa-aaaag-aaiqq-cai
  const video = await storage.getVideo(Principal.fromText('64cwk-jqaaa-aaaag-aaiqq-cai'));
  console.log(video);
  await writeVideoToFile('./videos/downloaded-demo-video.mp4', video.videoBuffer);
}

async function changeTitleDescription() {
  try {
    await storage.updateMetadata({
      identity: identityBronte,
      videoPrincipal: Principal.fromText('64cwk-jqaaa-aaaag-aaiqq-cai'),
      newName: 'Holiday 2022',
      newDescription: 'Woman relaxing in water',
    });
  } catch (error) {
    console.error('Could not update metadata', error);
  }
}

async function changeOwnerMary() {
  await storage.changeOwner({
    oldIdentity: identityBronte,
    oldWallet: walletId,
    videoPrincipal: Principal.fromText('64cwk-jqaaa-aaaag-aaiqq-cai'),
    newOwner: identityMary.getPrincipal(),
    newOwnerWallet: walletId,
  });
}

async function changeVideo() {
  const file = await readFile('./videos/change-demo-video.mp4');
  const newChunkNum = Math.floor(file.length / chunkSize) + 1;
  await storage.updateVideo({
    identity: identityMary,
    videoPrincipal: Principal.fromText('64cwk-jqaaa-aaaag-aaiqq-cai'),
    newChunkNum,
    newVideoBuffer: file,
  });
}

runDemo();
