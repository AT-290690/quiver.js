import { quiver } from './quiver/index.js';
quiver({
  dir: 'examples/exp11_ui',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv',
  sync: true
});
