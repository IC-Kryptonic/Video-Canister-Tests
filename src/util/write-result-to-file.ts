import { promises as fs } from 'fs';

const filePath = '/../../results/cost-benchmarks.txt';

export async function writeToFile(text: string) {
  console.log(text);
  try {
    await fs.appendFile(__dirname + filePath, `\n${text}`);
  } catch (error) {
    console.error('Error: unable to write to log file:' + error);
    process.exit(-1);
  }
}
