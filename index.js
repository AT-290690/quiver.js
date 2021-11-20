import { quiver } from './quiver/index.js';
quiver({
  dir: 'examples/exp10_fizzbuzz',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv',
  sync: true
});
