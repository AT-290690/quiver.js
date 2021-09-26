import * as fs from 'fs';
import compile from './quiver.js';
// first will be the root
const dir = './example/main/';
const files = ['server.go', 'request.go', 'cats.go', 'age.go'];
(async () => {
  for (const file of files) {
    await compile(dir + file, files);
  }
})();
