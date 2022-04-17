import { CostProperties, Metadata } from './interfaces';
import { dollarPerMB, getDollarPrice } from './util/currency-conversion';
import { downloadUserVideo, getCanisterBalance, getMetaInfo, putMetaInfo, uploadUserVideo } from './util/dfx-commands';
import { writeToFile } from './util/write-result-to-file';

export async function testPutMetadata(principal: string, metadata: Metadata, costProperties: CostProperties) {
  await writeToFile('------- TESTING COSTS FOR PUTTING METADATA -------');
  await writeToFile(`Test time: ${new Date(Date.now()).toString()}`);
  const canisterBalanceBefore = await getCanisterBalance(principal);
  await putMetaInfo(principal, metadata);
  const canisterBalanceAfter = await getCanisterBalance(principal);
  await writeToFile('canisterBalanceBefore ' + canisterBalanceBefore);
  await writeToFile('canisterBalanceAfter ' + canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  await writeToFile('canisterBalanceDiff ' + canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  await writeToFile(`diff in dollar ${diffInDollar}\n`);
}

export async function testReadMetadata(principal: string, costProperties: CostProperties) {
  await writeToFile('------- TESTING COSTS FOR READING METADATA -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  await getMetaInfo(principal);
  const canisterBalanceAfter = await getCanisterBalance(principal);
  await writeToFile('canisterBalanceBefore ' + canisterBalanceBefore);
  await writeToFile('canisterBalanceAfter ' + canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  await writeToFile('canisterBalanceDiff ' + canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  await writeToFile(`diff in dollar ${diffInDollar}\n`);
}

export async function testUploadVideo(principal: string, file: Buffer, costProperties: CostProperties) {
  await writeToFile('------- TESTING COSTS FOR UPLOADING USER VIDEO -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  var startDate = new Date();
  await uploadUserVideo(principal, file, costProperties);
  var endDate = new Date();
  const canisterBalanceAfter = await getCanisterBalance(principal);
  await writeToFile('canisterBalanceBefore ' + canisterBalanceBefore);
  await writeToFile('canisterBalanceAfter ' + canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  await writeToFile('canisterBalanceDiff ' + canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  await writeToFile('diff in dollar ' + diffInDollar);
  const costDollarPerMB = dollarPerMB(costProperties.fileSize || 0, canisterBalanceDiff);
  await writeToFile('dollar per uploaded MB ' + costDollarPerMB);
  const timeForUpload = (endDate.getTime() - startDate.getTime()) / 1000;
  await writeToFile(`upload duration in seconds ${timeForUpload}\n`);
}

export async function testDownloadVideo(principal: string, costProperties: CostProperties) {
  await writeToFile('------- TESTING COSTS FOR DOWNLOADING USER VIDEO -------');
  const canisterBalanceBefore = await getCanisterBalance(principal);
  var startDate = new Date();
  await downloadUserVideo(principal);
  var endDate = new Date();
  const canisterBalanceAfter = await getCanisterBalance(principal);
  await writeToFile('canisterBalanceBefore ' + canisterBalanceBefore);
  await writeToFile('canisterBalanceAfter ' + canisterBalanceAfter);
  const canisterBalanceDiff = canisterBalanceBefore - canisterBalanceAfter;
  await writeToFile('canisterBalanceDiff ' + canisterBalanceDiff);
  const diffInDollar = getDollarPrice(canisterBalanceDiff);
  await writeToFile('diff in dollar ' + diffInDollar);
  const costDollarPerMB = dollarPerMB(costProperties.fileSize || 0, canisterBalanceDiff);
  await writeToFile('dollar per downloaded MB ' + costDollarPerMB);
  await writeToFile('dollar per downloaded GB ' + costDollarPerMB * 1000);
  const timeForDownload = (endDate.getTime() - startDate.getTime()) / 1000;
  await writeToFile(`download duration in seconds ${timeForDownload}\n`);
}
