enum Network {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

export interface Metadata {
  name: string;
  description: string;
  chunk_num: number;
}

export interface CostProperties {
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
