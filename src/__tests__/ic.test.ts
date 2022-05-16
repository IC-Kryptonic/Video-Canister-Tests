import { ICVideoStorage } from 'ic-video-storage';
import { StorageConfig, VideoToStore } from 'ic-video-storage/build/interfaces';
import { Principal } from '@dfinity/principal';
import { identityBronte, identityMary } from '../../identities/identities';
import wallets from '../../.dfx/local/wallets.json';
import { readFile } from '../util/file-parsing';

jest.setTimeout(60_000);

/*
This test suite tests the complete package functionality
- upload video √
- get video principal from canister and compare with returned principal from upload √
- download and compare video and metadata with upload √
- change video metadata in the created canister √
- change video in the created canister √
- change the owner of the canister √
- confirm that old owner cannot change the metadata anymore √
- confirm that old owner cannot change the video anymore √
- change video metadata with the new owner √
- change video with the new owner √
*/

describe('local end-to-end testing of all package functionality', () => {
  let localWallet: Principal;
  try {
    localWallet = Principal.fromText(wallets.identities.default.local);
  } catch (error) {
    console.error('You need to create a local wallet for this test first');
    process.exit(-1);
  }

  const chunkSize = 1000000;

  const storageConfig: StorageConfig = {
    spawnCanisterPrincipalId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    indexCanisterPrincipalId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
    storeOnIndex: true,
    chunkSize,
  };

  const storage = new ICVideoStorage(storageConfig);

  let uploadedVideoPrincipal: Principal;
  let video: VideoToStore;
  let file: Buffer;

  test.only('uploads a video to a new canister', async () => {
    file = await readFile('./videos/video.mp4');

    video = {
      name: 'My Favourite Video',
      description: 'Memories from 2021',
      videoBuffer: file,
    };

    uploadedVideoPrincipal = await storage.uploadVideo({
      identity: identityBronte,
      walletId: localWallet,
      video: video,
      cycles: BigInt(250000000000),
    });

    // this fails if the returned principal does not have a valid syntax
    Principal.fromText(uploadedVideoPrincipal.toText());
    console.log(uploadedVideoPrincipal.toText());
  });

  test('queries video principal from index_canister and compares with upload result', async () => {
    const videoPrincipals = await storage.getMyVideos(identityBronte);
    const videoPrincipalTexts = videoPrincipals.map((principal) => principal.toText());

    expect(videoPrincipals.length).toBeGreaterThan(0);
    expect(videoPrincipalTexts).toContain(uploadedVideoPrincipal.toText());
    console.log(uploadedVideoPrincipal.toText());
  });

  test('queries video from video_canister and compares with upload', async () => {
    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.name).toBe(video.name);
    expect(videoInCanister.description).toBe(video.description);
    expect(videoInCanister.videoBuffer).toEqual(video.videoBuffer);
    expect(videoInCanister.version).toBeGreaterThanOrEqual(0);
    expect(videoInCanister.owner.toText()).toBe(identityBronte.getPrincipal().toText());
  });

  test('updates metadata in existing canister', async () => {
    const newName = 'newName';
    const newDescription = 'newDescription';
    await storage.updateMetadata({
      identity: identityBronte,
      principal: uploadedVideoPrincipal,
      name: newName,
      description: newDescription,
    });

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.name).toBe(newName);
    expect(videoInCanister.description).toBe(newDescription);
    expect(videoInCanister.videoBuffer).toEqual(video.videoBuffer);
    expect(videoInCanister.version).toBeGreaterThanOrEqual(0);
    expect(videoInCanister.owner.toText()).toBe(identityBronte.getPrincipal().toText());
  });

  test('updates video in existing canister', async () => {
    const newFile = await readFile('./videos/video2.mp4');
    const newChunkNum = Math.floor(newFile.length / chunkSize) + 1;
    await storage.updateVideo({
      identity: identityBronte,
      principal: uploadedVideoPrincipal,
      chunkNum: newChunkNum,
      videoBuffer: newFile,
    });
    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);
    expect(videoInCanister.videoBuffer.equals(newFile)).toBe(true);
    expect(videoInCanister.version).toBeGreaterThanOrEqual(0);
    expect(videoInCanister.owner.toText()).toBe(identityBronte.getPrincipal().toText());
  });

  test('changes the owner of a video canister', async () => {
    await storage.changeOwner({
      oldIdentity: identityBronte,
      oldWallet: localWallet,
      videoPrincipal: uploadedVideoPrincipal,
      newOwner: identityMary.getPrincipal(),
      newOwnerWallet: localWallet,
    });

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.owner.toText()).toBe(identityMary.getPrincipal().toText());
    expect(videoInCanister.owner.toText()).not.toBe(identityBronte.getPrincipal().toText());
  });

  test('non-owner tries to change the owner of a video canister', async () => {
    const principal = Principal.fromText('mc6fg-g6p57-ehary-n3dz6-mf26q-vlz42-xmi4t-2o5zq-5tcbl-zsmi6-4ae');
    const expectedErrorCode = 'missing_rights';
    let expectedErrorOcurred = false;
    let consoleError = console.error;

    try {
      // suppress expected error message in jest console output
      console.error = jest.fn();
      await storage.changeOwner({
        oldIdentity: identityBronte,
        oldWallet: localWallet,
        videoPrincipal: uploadedVideoPrincipal,
        newOwner: principal,
        newOwnerWallet: localWallet,
      });
    } catch (error) {
      if (String(error).includes(expectedErrorCode)) expectedErrorOcurred = true;
    } finally {
      console.error = consoleError;
    }

    expect(expectedErrorOcurred).toBe(true);

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.owner.toText()).toBe(identityMary.getPrincipal().toText());
    expect(videoInCanister.owner.toText()).not.toBe(identityBronte.getPrincipal().toText());
    expect(videoInCanister.owner.toText()).not.toBe(principal.toText());
  });

  test('tries to change metadata with non owning identity', async () => {
    const newName = video.name + 'wrong';
    const newDescription = video.description + 'wrong';
    const expectedErrorCode = 'missing_rights';
    let expectedErrorOcurred = false;
    let consoleError = console.error;
    try {
      // suppress expected error message in jest console output
      console.error = jest.fn();
      await storage.updateMetadata({
        identity: identityBronte,
        principal: uploadedVideoPrincipal,
        name: newName,
        description: newDescription,
      });
    } catch (error) {
      if (String(error).includes(expectedErrorCode)) expectedErrorOcurred = true;
    } finally {
      console.error = consoleError;
    }

    expect(expectedErrorOcurred).toBe(true);

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.name).not.toBe(newName);
    expect(videoInCanister.description).not.toBe(newDescription);
  });

  test('tries to change video with non owning identity', async () => {
    const newFile = await readFile('./videos/video2.mp4');
    const newChunkNum = Math.floor(newFile.length / chunkSize) + 1;
    const expectedErrorCode = 'missing_rights';
    let expectedErrorOcurred = false;
    let consoleError = console.error;
    try {
      // suppress expected error message in jest console output
      console.error = jest.fn();
      await storage.updateVideo({
        identity: identityBronte,
        principal: uploadedVideoPrincipal,
        chunkNum: newChunkNum,
        videoBuffer: newFile,
      });
    } catch (error) {
      if (String(error).includes(expectedErrorCode)) expectedErrorOcurred = true;
    } finally {
      console.error = consoleError;
    }

    expect(expectedErrorOcurred).toBe(true);
  });

  test('updates metadata with new owner', async () => {
    const newName = video.name + 'right';
    const newDescription = video.description + 'right';

    await storage.updateMetadata({
      identity: identityMary,
      principal: uploadedVideoPrincipal,
      name: newName,
      description: newDescription,
    });

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.name).toBe(newName);
    expect(videoInCanister.description).toBe(newDescription);
  });

  test('updates video with new owner', async () => {
    const newFile = await readFile('./videos/video3.mp4');
    const newChunkNum = Math.floor(newFile.length / chunkSize) + 1;

    await storage.updateVideo({
      identity: identityMary,
      principal: uploadedVideoPrincipal,
      chunkNum: newChunkNum,
      videoBuffer: newFile,
    });

    const videoInCanister = await storage.getVideo(uploadedVideoPrincipal);

    expect(videoInCanister.videoBuffer.equals(newFile)).toBe(true);
    expect(videoInCanister.version).toBeGreaterThanOrEqual(0);
    expect(videoInCanister.owner.toText()).toBe(identityMary.getPrincipal().toText());
  });
});
