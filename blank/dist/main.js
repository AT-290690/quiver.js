import { Quiver } from '../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  NDOE: { key: 'NDOE', next: ['LOG'], prev: null, level: 0, type: 'root' },
  LOG: { key: 'LOG', next: [], prev: 'NDOE', level: 1, type: 'leaf' }
});

__qvr.func['NDOE'] = async (value, key, prev, next) => {
  return 'Quiver!';
};
__qvr.func['LOG'] = async (value, key, prev, next) => {
  return console.log(value);
};
export default () => {
  __qvr.setRoot(__qvr.nodes['NDOE'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
