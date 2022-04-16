import util from 'util';
import { exec as childExec } from 'child_process';
import { exitWithError } from './error-handling';

const exec = util.promisify(childExec);

export async function getWalletBalance(): Promise<number> {
  let balance = 0;
  try {
    const { stdout, stderr } = await exec('dfx wallet --network ic balance');
    console.log(stdout, stderr);
    balance = +stdout.match(/\d/g).join('');
    // cycles aus string parsen
  } catch (error) {
    exitWithError(error.toString());
  }
  return balance;
}
