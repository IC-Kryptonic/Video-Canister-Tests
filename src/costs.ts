// znjpg-oiaaa-aaaaa-aabua-cai
// we always push 1 chunk (0.01MB)
// result:
// cost per 0.01MB upload in cycles: 8020663
// cost per 1MB / 1_000_000 Bytes upload in cycles: 802066375
// cost per Byte upload in cycles: 805
const initialCycles = 182_099_944_464;
const cyclesAfterPush1 = 182_091_805_007;
const cyclesAfterPush2 = 182_083_759_607;
const cyclesAfterPush3 = 182_075_715_427;
const cyclesAfterPush4 = 182_067_698_765;
const cyclesAfterStatus = 182_067_658_004;
const cyclesAfterStatus2 = 182_067_617_243;

const costsForStatusRequest = (cyclesAfterPush4 - cyclesAfterStatus2) / 2;
console.log('costs for canister status requrest', costsForStatusRequest);
const costsPerPush = (initialCycles - cyclesAfterPush4 - costsForStatusRequest * 4) / 4;
console.log('costs per byte push', costsPerPush / 10000);

const initialCycles2 = 182_065_715_063;
const cyclesAfterGet = 182_064_807_007;
const cyclesAfterGet2 = 182_063_912_538;
const cyclesAfterGet3 = 182_063_045_243;
const cyclesAfterGet4 = 182_062_164_361;

const costsPerGet = (initialCycles2 - cyclesAfterGet4 - costsForStatusRequest * 4) / 4;
console.log('costs per byte get', costsPerGet / 10000);

const fileSizeInBytes = 78839282;
const cyclesIn = 180_000_000_000;
console.log('real cycle consumage per bytes', cyclesIn / fileSizeInBytes);
const fileSizeInBytes2 = 5905882;
const cyclesIn2 = 20_977_692_864;
console.log('wtf cycle consumage per bytes', cyclesIn2 / fileSizeInBytes2);
console.log('ok cool', 805 * fileSizeInBytes);
// 63_465_622_010

// results:
// filesize: 5905882, cycles in: 300_000_000_000, cycles left: 283_245_445_890
// filesize: 5905882, cycles in: 200_000_000_000, cycles left: 83_245_445_890
// filesize: 5905882, cycles in: 250_000_000_000, cycles left: 183_245_325_836
// filesize: 4466282, cycles in: 300_000_000_000, cycles left: 287_180_268_941
// filesize: 37625805, cycles in: 300_000_000_000, cycles left: 196_516_948_046
// filesize: 78839282, cycles in: 300_000_000_000, cycles left: 83_832_749_186
const cyclesUsed1 = (200_000_000_000 - 83_245_472_773) / 5905882;
const cyclesUsed2 = (300_000_000_000 - 287_180_268_941) / 4466282;
const cyclesUsed3 = (300_000_000_000 - 196_516_948_046) / 37625805;
const cyclesUsed4 = (300_000_000_000 - 83_832_749_186) / 78839282;
console.log('cyclesUsed1', cyclesUsed1);
console.log('cyclesUsed2', cyclesUsed2);
console.log('cyclesUsed3', cyclesUsed3);
console.log('cyclesUsed4', cyclesUsed4);

// on chain
console.log('on chain');
const cyclesUsed11 = (250_000_000_000 - 183_681_641_738) / 5905882;
const cyclesUsed21 = (270_000_000_000 - 223_682_386_098) / 5905882;
const cyclesUsed31 = (290_000_000_000 - 263_682_381_422) / 5905882;
const cyclesUsed41 = (310_000_000_000 - 303_681_702_555) / 5905882;
console.log('cycles per byte', cyclesUsed11);
console.log('cycles per byte', cyclesUsed21);
console.log('cycles per byte', cyclesUsed31);
console.log('cycles per byte', cyclesUsed41);
