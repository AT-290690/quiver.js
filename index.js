import { quiver } from './quiver/index.js';
quiver({
  dir: 'blank',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv',
  sync: true
});
