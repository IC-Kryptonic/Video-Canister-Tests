import util from 'util';
import { exec as childExec } from 'child_process';
import { exitWithError } from './error-handling';
import { Metadata } from '../interfaces';

const exec = util.promisify(childExec);

export async function getWalletBalance(): Promise<number> {
  let balance = 0;
  try {
    const { stdout, stderr } = await exec('dfx wallet --network ic balance');
    balance = +stdout.match(/\d/g).join('');
  } catch (error) {
    exitWithError(error.toString());
  }
  return balance;
}

export async function getCanisterBalance(principal: string): Promise<number> {
  let balance = 0;
  try {
    const { stdout, stderr } = await exec(`dfx canister --network ic status ${principal}`);
    // output can be in stderr if dfx.json is not present
    const output = stdout + stderr;
    balance = +output
      .match(/(?<=Balance: )(.*)(?= Cycles)/g)
      .join('')
      .replace(/_/g, '');
  } catch (error) {
    exitWithError(error.toString());
  }
  return balance;
}

export async function getMetaInfo(principal: string): Promise<Metadata> {
  let metadata: Metadata;
  try {
    await exec(`dfx canister --network ic call ${principal} get_meta_info`);
  } catch (error) {
    exitWithError(error.toString());
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
    exitWithError(error.toString());
  }
}
