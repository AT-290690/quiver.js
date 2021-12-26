import { quiver } from './quiver/index.js';
quiver({
  dir: 'examples/exp11_bingo',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv',
  sync: true
});
