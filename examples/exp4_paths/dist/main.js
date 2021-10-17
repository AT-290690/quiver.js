import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  start: { key: 'start', next: [], prev: null, level: 0, type: 'root' },
  a: { key: 'a', next: [], prev: null, level: 0, type: 'root' },
  g: { key: 'g', next: ['m', 'l', 'b'], prev: null, level: 0, type: 'root' },
  m: { key: 'm', next: [], prev: 'g', level: 1, type: 'leaf' },
  l: { key: 'l', next: [], prev: 'g', level: 1, type: 'leaf' },
  b: { key: 'b', next: ['c'], prev: 'g', level: 1, type: 'branch' },
  c: { key: 'c', next: ['d'], prev: 'b', level: 2, type: 'branch' },
  d: { key: 'd', next: ['e', 'asad'], prev: 'c', level: 3, type: 'branch' },
  e: { key: 'e', next: [], prev: 'd', level: 4, type: 'leaf' },
  asad: { key: 'asad', next: [], prev: 'd', level: 4, type: 'leaf' }
});

__qvr.func['start'] = async (value, key, prev, next) => {
  const traces = [
    __qvr.trace('g', 'e'),
    __qvr.trace('g', 'l'),
    __qvr.trace('b', 'asad')
  ];
  const paths = traces.map(t => __qvr.path(t));
  __qvr.log(await __qvr.go('g')(5));
  __qvr.log(await paths[0].goTo('g', 5));

  __qvr.log(await paths[0].goTo('g', 25));
  __qvr.log(await paths[1].goTo('g', 15));
  __qvr.log(await paths[2].goTo('b', 13));
};
__qvr.func['a'] = async (value, key, prev, next) => {
  return value;
};
__qvr.func['g'] = async (value, key, prev, next) => {
  return value;
};
__qvr.func['m'] = async (value, key, prev, next) => {
  return value + 15;
};
__qvr.func['l'] = async (value, key, prev, next) => {
  return value - 25;
};
__qvr.func['b'] = async (value, key, prev, next) => {
  return value * 2;
};
__qvr.func['c'] = async (value, key, prev, next) => {
  return value + 3;
};
__qvr.func['d'] = async (value, key, prev, next) => {
  return value + 3;
};
__qvr.func['e'] = async (value, key, prev, next) => {
  return value + 5;
};
__qvr.func['asad'] = async (value, key, prev, next) => {
  return value * 5;
};
export default () => {
  __qvr.setRoot(__qvr.nodes['start'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
