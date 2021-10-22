import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({
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

quiv.arrows['start'] = async (value, key, prev, next) => {
  const traces = [
    quiv.trace('g', 'e'),
    quiv.trace('g', 'l'),
    quiv.trace('b', 'asad')
  ];
  const paths = traces.map(t => quiv.path(t));
  quiv.log(await quiv.goTo('g', 5));
  quiv.log(await paths[0].goTo('g', 5));

  quiv.log(await paths[0].goTo('g', 25));
  quiv.log(await paths[1].goTo('g', 15));
  quiv.log(await paths[2].goTo('b', 13));
};
quiv.arrows['a'] = async (value, key, prev, next) => {
  return value;
};
quiv.arrows['g'] = async (value, key, prev, next) => {
  return value;
};
quiv.arrows['m'] = async (value, key, prev, next) => {
  return value + 15;
};
quiv.arrows['l'] = async (value, key, prev, next) => {
  return value - 25;
};
quiv.arrows['b'] = async (value, key, prev, next) => {
  return value * 2;
};
quiv.arrows['c'] = async (value, key, prev, next) => {
  return value + 3;
};
quiv.arrows['d'] = async (value, key, prev, next) => {
  return value + 3;
};
quiv.arrows['e'] = async (value, key, prev, next) => {
  return value + 5;
};
quiv.arrows['asad'] = async (value, key, prev, next) => {
  return value * 5;
};
export default value => {
  quiv.setRoot(quiv.nodes['start'].key);
  quiv.reset();
  quiv.goTo(quiv.root, value);
};
