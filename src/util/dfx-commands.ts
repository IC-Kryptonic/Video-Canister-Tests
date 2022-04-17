import util from 'util';
import { exec as childExec } from 'child_process';
import { exitWithError } from './error-handling';
import { CostProperties, Metadata } from '../interfaces';
import { CHUNK_SIZE } from '..';

const exec = util.promisify(childExec);

function matchString(input: string, regex: RegExp): RegExpMatchArray {
  const matchedInput = input.match(regex);
  return matchedInput || [];
}

export async function getWalletBalance(): Promise<number> {
  let balance = 0;
  try {
    const { stdout, stderr } = await exec('dfx wallet --network ic balance');
    balance = +matchString(stdout, /\d/g).join('');
  } catch (error) {
    exitWithError('' + error);
  }
  return balance;
}

export async function getCanisterBalance(principal: string): Promise<number> {
  let balance = 0;
  try {
    const { stdout, stderr } = await exec(`dfx canister --network ic status ${principal}`);
    // output can be in stderr if dfx.json is not present
    const output = stdout + stderr;
    balance = +matchString(output, /(?<=Balance: )(.*)(?= Cycles)/g)
      .join('')
      .replace(/_/g, '');
  } catch (error) {
    exitWithError('' + error);
  }
  return balance;
}

export async function getMetaInfo(principal: string): Promise<Metadata> {
  let metadata: Metadata = {};
  try {
    const { stdout, stderr } = await exec(`dfx canister --network ic call ${principal} get_meta_info`);
    // output can be in stderr if dfx.json is not present
    const output = stdout + stderr;
    metadata.chunk_num = +matchString(output, /(?<=2_808_751_156 = )(.*)(?= : nat64)/g)
      .join('')
      .replace(/_/g, '');
    metadata.description = matchString(output, /(?<=1_595_738_364 = ")(.*)(?=";)/g).join('');
    metadata.name = matchString(output, /(?<=1_224_700_491 = ")(.*)(?=";)/g).join('');
  } catch (error) {
    exitWithError('' + error);
  }
  return metadata;
}

export async function putMetaInfo(principal: string, metadata: Metadata) {
  try {
    await exec(
      `dfx canister --network ic call ${principal} put_meta_info ` +
        `'(record {name="${metadata.name}"; description="${metadata.description}"; chunk_num=${metadata.chunk_num}:nat64})'`,
    );
  } catch (error) {
    exitWithError('' + error);
  }
}

// upload via command line is limited to max 100_000 chunk size because of command line length restrictions
export async function uploadUserVideo(principal: string, file: Buffer, costProperties: CostProperties) {
  try {
    const promises = [];
    for (let i = 0; i < (costProperties.fileChunkNum || 0); i++) {
      const chunkSlice = file.slice(i * CHUNK_SIZE, Math.min(file.length, (i + 1) * CHUNK_SIZE));
      const chunkArray = Array.from(chunkSlice);
      const chunksAsVector = chunkArray.join(':nat8; ') + ':nat8;';
      promises.push(
        exec(`dfx canister --network ic call ${principal} put_chunk '(${i}:nat64, vec { ${chunksAsVector} })'`),
      );
    }
    await Promise.all(promises);
  } catch (error) {
    exitWithError('Error putting chunk:' + error);
  }
}

export async function downloadUserVideo(principal: string) {
  const metadata = await getMetaInfo(principal);
  try {
    const promises = Array.from(Array(metadata.chunk_num || 0).keys()).map((i) =>
      exec(`dfx canister --network ic call ${principal} get_chunk '(${i}:nat64)'`),
    );
    await Promise.all(promises);
    console.log(`> Successfully downloaded ${metadata.chunk_num} chunks.`);
  } catch (error) {
    exitWithError('' + error);
  }
}
