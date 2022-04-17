import { CostProperties, Metadata } from './interfaces';
import { dollarPerMB, getDollarPrice } from './util/currency-conversion';
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
  var startDate = new Date();
  await uploadUserVideo(principal, file, costProperties);
  var endDate = new Date();
  const canisterBalanceAfter = await getCanisterBalance(principal);
  console.log('canisterBalanceBefore', canisterBalanceBefore);
  console.log('canisterBalanceAfter', canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  console.log('canisterBalanceDiff', canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  console.log('diff in dollar', diffInDollar);
  const costDollarPerMB = dollarPerMB(costProperties.fileSize, canisterBalanceDiff);
  console.log('dollar per uploaded MB', costDollarPerMB);
  const timeforUpload = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log('upload duration', timeforUpload);
  console.log('--------------');
  // Do your operations
}
