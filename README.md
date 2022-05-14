hello :)

Files ausfuehren z.b. so `ts-node src/test.ts`

# local tests

1. generate new local wallet `dfx wallet controllers` (only generates one if there isn't one already)
2. add bronte (our test identity) as a controller to the wallet `dfx wallet add-controller 6dhkj-uu4ze-3qi7y-c3g72-guy7g-wfwwt-vk2cn-epzg3-vkoit-5vjog-4ae`
3. add mary (our second test identity) as a controller to the wallet `dfx wallet add-controller d7626-uez75-pqpoi-2r5wz-53xve-e7eyg-dijvc-zyhaw-tvg7c-e7uct-aae`
4. run `npm run test-local`

# ic tests

1. generate ic wallet and charge it with cycles
2. add bronte (our test identity) as a controller to the wallet `dfx wallet --network ic add-controller 6dhkj-uu4ze-3qi7y-c3g72-guy7g-wfwwt-vk2cn-epzg3-vkoit-5vjog-4ae`
3. add mary (our second test identity) as a controller to the wallet `dfx wallet --network ic add-controller d7626-uez75-pqpoi-2r5wz-53xve-e7eyg-dijvc-zyhaw-tvg7c-e7uct-aae`
4. replace value for icWalletId in `ic.test.ts`
5. run `npm run test-ic`
