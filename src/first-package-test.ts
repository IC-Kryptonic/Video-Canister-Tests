import { ICVideoStorage } from 'ic-video-storage';
import { InternalStorageConfig } from 'ic-video-storage/build/interfaces';
import { AnonymousIdentity } from '@dfinity/agent';

const storageConfig: InternalStorageConfig = {
  spawnCanisterPrincipal: '',
  indexCanisterPrincipal: '',
  chunkSize: 0,
  storeOnIndex: false,
};

async function test() {
  const storage = new ICVideoStorage(storageConfig);

  const anon = new AnonymousIdentity();
  console.log(await storage.getMyVideos(anon));
}

test();
