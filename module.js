import * as fs from 'fs';
import compile from './quiver.js';
const { readdir } = fs.promises;

const dir = './example/main/';

const files = await readdir(dir);
files
  .filter(file => file?.split('.').pop() === 'go')
  .forEach((file, _, files) => compile(dir + file));