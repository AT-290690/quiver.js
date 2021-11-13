import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({
  FIZZ_BUZZ: {
    key: 'FIZZ_BUZZ',
    next: ['fn[1]'],
    prev: null,
    level: 0,
    group: 0,
    type: 'root'
  },
  'fn[1]': {
    key: 'fn[1]',
    next: ['fn[9]', 'fn[10]', 'fn[11]', 'fn[12]'],
    prev: 'FIZZ_BUZZ',
    level: 1,
    group: 0,
    type: 'branch'
  },
  'fn[9]': {
    key: 'fn[9]',
    next: [],
    prev: 'fn[1]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[10]': {
    key: 'fn[10]',
    next: [],
    prev: 'fn[1]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[11]': {
    key: 'fn[11]',
    next: [],
    prev: 'fn[1]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[12]': {
    key: 'fn[12]',
    next: [],
    prev: 'fn[1]',
    level: 2,
    group: 0,
    type: 'leaf'
  }
});

quiv.fn['FIZZ_BUZZ'] = (value, key, prev, next) => {
  return 250;
};
quiv.fn['fn[1]'] = (value, key, prev, next) => {
  return {
    number: value,
    when: [value % 15 === 0, value % 3 === 0, value % 5 === 0].map(Number)
  };
};
quiv.fn['fn[9]'] = (value, key, prev, next) => {
  if (
    ![{ when: [1, 1, 1] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('FizzBuzz');
};
quiv.fn['fn[10]'] = (value, key, prev, next) => {
  if (
    ![{ when: [0, 1, 0] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('Fizz');
};
quiv.fn['fn[11]'] = (value, key, prev, next) => {
  if (
    ![{ when: [0, 0, 1] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('Buzz');
};
quiv.fn['fn[12]'] = (value, key, prev, next) => {
  const { number } = value;
  if (
    ![{ when: [0, 0, 0] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log(number);
};
export default value => {
  quiv.setRoot(quiv.nodes['FIZZ_BUZZ'].key);
  quiv.visited = {};
  quiv.goTo(quiv.root, value);
};
