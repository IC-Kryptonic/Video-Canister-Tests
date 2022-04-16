export function exitWithError(error: string) {
  console.error(error);
  process.exit(-1);
}
