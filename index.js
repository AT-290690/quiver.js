import { quiver } from './quiver/index.js';
quiver({
  dir: 'examples/exp7_last_arrow_rec',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv',
  sync: true
});
