const dollarPerCycle = 0.00000000000142;

export function getDollarPrice(cycles: number) {
  return cycles * dollarPerCycle;
}
