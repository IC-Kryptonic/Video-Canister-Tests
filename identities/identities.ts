import { Secp256k1KeyIdentity } from '@dfinity/identity';

const publicKeyBronte = new Uint8Array([
  4, 203, 50, 75, 248, 81, 38, 47, 222, 95, 76, 233, 244, 167, 49, 150, 47, 108, 21, 163, 140, 119, 34, 122, 129, 17, 7,
  21, 143, 2, 137, 66, 252, 121, 77, 1, 91, 192, 119, 73, 175, 40, 88, 12, 158, 249, 54, 145, 125, 141, 150, 205, 173,
  194, 221, 64, 71, 166, 233, 46, 158, 191, 129, 29, 74,
]);

const privateKeyBronte = new Uint8Array([
  2, 218, 230, 45, 233, 221, 74, 40, 130, 118, 233, 148, 121, 127, 56, 167, 90, 29, 17, 212, 238, 192, 64, 247, 66, 73,
  88, 52, 101, 223, 229, 84,
]);

const publicKeyMary = new Uint8Array([
  4, 34, 70, 53, 221, 27, 53, 47, 104, 15, 45, 218, 42, 128, 44, 237, 34, 27, 16, 228, 203, 39, 161, 209, 98, 242, 140,
  82, 125, 35, 52, 66, 100, 217, 191, 140, 247, 24, 133, 148, 179, 53, 137, 107, 167, 233, 18, 190, 187, 153, 233, 2,
  113, 131, 123, 39, 34, 49, 5, 119, 17, 50, 110, 51, 193,
]);

const privateKeyMary = new Uint8Array([
  112, 8, 110, 77, 200, 216, 42, 176, 125, 212, 143, 136, 124, 121, 201, 141, 182, 103, 88, 11, 132, 86, 43, 45, 7, 146,
  8, 85, 235, 160, 246, 224,
]);

export const walletPrincipalId = '6cgjb-xaaaa-aaaag-aae6q-cai';
export const identityBronte: Secp256k1KeyIdentity = Secp256k1KeyIdentity.fromKeyPair(publicKeyBronte, privateKeyBronte);
export const principalBronte = '6dhkj-uu4ze-3qi7y-c3g72-guy7g-wfwwt-vk2cn-epzg3-vkoit-5vjog-4ae';
export const identityMary: Secp256k1KeyIdentity = Secp256k1KeyIdentity.fromKeyPair(publicKeyMary, privateKeyMary);
export const principalMary = 'd7626-uez75-pqpoi-2r5wz-53xve-e7eyg-dijvc-zyhaw-tvg7c-e7uct-aae';
