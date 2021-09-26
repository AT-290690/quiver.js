import * as fs from 'fs';
import compile from './quiver.js';
const { readdir } = fs.promises;

const dir = './example/module/';

const files = (await readdir(dir)).filter(
  file => file?.split('.').pop() === 'go'
);
(async () => {
  for (const file of files) {
    await compile(dir + file);
  }
})();
