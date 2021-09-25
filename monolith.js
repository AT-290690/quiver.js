import * as fs from 'fs';
import compile from './quiver.js';
const { readdir } = fs.promises;
// first will be the root
const dir = './example/mono/';

['root.go', 'amplifier.go', 'multiplier.go', 'logger.go'].forEach((file, _, files) => compile(dir + file, files));