import { quiver } from './quiver/index.js';
quiver({
  dir: 'examples/exp2_server',
  root: 'main.go',
  indentBy: '\t',
  namespace: 'quiv'
});
