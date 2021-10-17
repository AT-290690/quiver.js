import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  OUT: { key: 'OUT', next: [], prev: null, level: 0, type: 'root' },
  RECURSION: {
    key: 'RECURSION',
    next: ['ADD_TIMES'],
    prev: null,
    level: 0,
    type: 'root'
  },
  ADD_TIMES: {
    key: 'ADD_TIMES',
    next: [],
    prev: 'RECURSION',
    level: 1,
    type: 'leaf'
  }
});

__qvr.func['OUT'] = async (value, key, prev, next) => {
  return __qvr.log(
    (await __qvr.go('RECURSION')({ number: 5, val: 10, n: 5 }))['ADD_TIMES']
  );
};
__qvr.func['RECURSION'] = async (value, key, prev, next) => {
  return { ...value, count: !value.count ? 0 : value.count };
};
__qvr.func['ADD_TIMES'] = async (value, key, prev, next) => {
  const { number, n, val, count } = value;
  return n > value.count
    ? (
        await __qvr.go('RECURSION')({
          number: number * val,
          count: ++value.count,
          val,
          n
        })
      )['ADD_TIMES']
    : number;
};
export default () => {
  __qvr.setRoot(__qvr.nodes['OUT'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
