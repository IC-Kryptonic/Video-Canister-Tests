import { writeToFile } from './write-result-to-file';

export function exitWithError(error: string) {
  writeToFile(error);
  process.exit(-1);
}
