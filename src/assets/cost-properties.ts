enum Network {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

interface CostProperties {
  fileName?: string;
  fileSize?: number;
  startTime?: Date;
  endTime?: Date;
  network?: Network;
  initialWalletCycles?: number;
  finalWalletCycles?: number;
  initialVideoCanisterCycles?: number;
  postUploadVideoCanisterCycles?: number;
  postQueryVideoCanisterCycles?: number;
}
