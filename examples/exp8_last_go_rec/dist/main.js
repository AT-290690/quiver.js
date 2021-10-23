import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({
  START: { key: 'START', next: [], prev: null, level: 0, type: 'root' },
  LAST: {
    key: 'LAST',
    next: ['NULL', 'ONE', 'REC'],
    prev: null,
    level: 0,
    type: 'root'
  },
  NULL: { key: 'NULL', next: [], prev: 'LAST', level: 1, type: 'leaf' },
  ONE: { key: 'ONE', next: [], prev: 'LAST', level: 1, type: 'leaf' },
  REC: { key: 'REC', next: [], prev: 'LAST', level: 1, type: 'leaf' }
});

quiv.arrows['START'] = async (value, key, prev, next) => {
  const result = await quiv.go('LAST')([1, 2, 3]);
  quiv.log(result['REC']);
};
quiv.arrows['LAST'] = (value, key, prev, next) => {
  const [first, ...rest] = value;

  return { first, rest };
};
quiv.arrows['NULL'] = (value, key, prev, next) => {
  const { first } = value;

  if (first === undefined) return null;
};
quiv.arrows['ONE'] = (value, key, prev, next) => {
  const { first, rest } = value;

  if (quiv.test.isEqual(rest, [])) {
    quiv.visit('REC');
    return first;
  }
};
quiv.arrows['REC'] = async (value, key, prev, next) => {
  const { rest } = value;

  const out = await quiv.go('LAST')(rest);
  return out['REC'] ? out['REC'] : out['ONE'];
};
export default value => {
  quiv.setRoot(quiv.nodes['START'].key);
  quiv.visited = {};
  quiv.goTo(quiv.root, value);
};
