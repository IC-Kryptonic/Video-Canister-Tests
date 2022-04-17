import { CostProperties, Metadata } from './interfaces';
import { getDollarPrice } from './util/currency-conversion';
import { getCanisterBalance, getMetaInfo, putMetaInfo, uploadUserVideo } from './util/dfx-commands';

export async function testPutMetadata(principal: string, metadata: Metadata, costProperties: CostProperties) {
  console.log('------- TESTING COSTS FOR PUTTING METADATA -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  await putMetaInfo(principal, metadata);
  const canisterBalanceAfter = await getCanisterBalance(principal);
  console.log('canisterBalanceBefore', canisterBalanceBefore);
  console.log('canisterBalanceAfter', canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  console.log('canisterBalanceDiff', canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  console.log('diff in dollar', diffInDollar);
  console.log('--------------');
}

export async function testReadMetadata(principal: string, costProperties: CostProperties) {
  console.log('------- TESTING COSTS FOR READING METADATA -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  await getMetaInfo(principal);
  const canisterBalanceAfter = await getCanisterBalance(principal);
  console.log('canisterBalanceBefore', canisterBalanceBefore);
  console.log('canisterBalanceAfter', canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  console.log('canisterBalanceDiff', canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  console.log('diff in dollar', diffInDollar);
  console.log('--------------');
}

export async function testUploadVideo(principal: string, file: Buffer, costProperties: CostProperties) {
  console.log('------- TESTING COSTS FOR UPLOADING USER VIDEO -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  await uploadUserVideo(principal, file, costProperties);
  const canisterBalanceAfter = await getCanisterBalance(principal);
  console.log('canisterBalanceBefore', canisterBalanceBefore);
  console.log('canisterBalanceAfter', canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  console.log('canisterBalanceDiff', canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  console.log('diff in dollar', diffInDollar);
  console.log('--------------');
}
