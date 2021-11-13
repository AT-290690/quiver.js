import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({
  FIZZ_BUZZ: {
    key: 'FIZZ_BUZZ',
    next: ['fn[0]'],
    prev: null,
    level: 0,
    group: 0,
    type: 'root'
  },
  'fn[0]': {
    key: 'fn[0]',
    next: ['fn[1]', 'fn[2]', 'fn[3]', 'fn[4]'],
    prev: 'FIZZ_BUZZ',
    level: 1,
    group: 0,
    type: 'branch'
  },
  'fn[1]': {
    key: 'fn[1]',
    next: [],
    prev: 'fn[0]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[2]': {
    key: 'fn[2]',
    next: [],
    prev: 'fn[0]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[3]': {
    key: 'fn[3]',
    next: [],
    prev: 'fn[0]',
    level: 2,
    group: 0,
    type: 'leaf'
  },
  'fn[4]': {
    key: 'fn[4]',
    next: [],
    prev: 'fn[0]',
    level: 2,
    group: 0,
    type: 'leaf'
  }
});

quiv.fn['FIZZ_BUZZ'] = (value, key, prev, next) => {
  return 250;
};
quiv.fn['fn[0]'] = (value, key, prev, next) => {
  return {
    number: value,
    when: [+(value % 15 === 0), +(value % 3 === 0), +(value % 5 === 0)]
  };
};
quiv.fn['fn[1]'] = (value, key, prev, next) => {
  if (
    ![{ when: [1, 1, 1] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('FizzBuzz');
};
quiv.fn['fn[2]'] = (value, key, prev, next) => {
  if (
    ![{ when: [0, 1, 0] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('Fizz');
};
quiv.fn['fn[3]'] = (value, key, prev, next) => {
  if (
    ![{ when: [0, 0, 1] }].some(predicate =>
      quiv.test.isEqual(predicate, value, { partial: true })
    )
  )
    return undefined;
  return quiv.log('Buzz');
};
quiv.fn['fn[4]'] = (value, key, prev, next) => {
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
