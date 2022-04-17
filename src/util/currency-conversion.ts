const dollarPerCycle = 0.00000000000142;

export function getDollarPrice(cycles: number) {
  return cycles * dollarPerCycle;
}

export function byteToMB(byteNo: number) {
  return byteNo / 1000000;
}

export function dollarPerMB(byteNo: number, cycles: number) {
  const totalDollars = getDollarPrice(cycles);
  const totalMB = byteToMB(byteNo);
  return totalDollars / totalMB;
}
