import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  HELLO: { key: 'HELLO', next: ['SPACE'], prev: null, level: 0, type: 'root' },
  SPACE: {
    key: 'SPACE',
    next: ['WORLD'],
    prev: 'HELLO',
    level: 1,
    type: 'branch'
  },
  WORLD: { key: 'WORLD', next: ['!'], prev: 'SPACE', level: 2, type: 'branch' },
  '!': { key: '!', next: ['PRINT'], prev: 'WORLD', level: 3, type: 'branch' },
  PRINT: { key: 'PRINT', next: [], prev: '!', level: 4, type: 'leaf' }
});
/* 
Example 0
Demonstrating simple hello world program
*/

__qvr.func['HELLO'] = async (value, key, prev, next) => {
  return 'Hello';
};
__qvr.func['SPACE'] = async (value, key, prev, next) => {
  return value + ' ';
};
__qvr.func['WORLD'] = async (value, key, prev, next) => {
  return value + 'World';
};
__qvr.func['!'] = async (value, key, prev, next) => {
  return value + '!';
};
__qvr.func['PRINT'] = async (value, key, prev, next) => {
  return __qvr.log(value);
};
export default () => {
  __qvr.setRoot(__qvr.nodes['HELLO'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
