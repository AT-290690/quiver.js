import compile from './quiver.js';
// first will be the root
const dir = './example/mono/';
const files = ['root.go', 'amplifier.go', 'multiplier.go', 'logger.go'];
(async () => {
  for (const file of files) {
    await compile(dir + file, files);
  }
})();
