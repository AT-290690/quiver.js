import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  AGE: { key: 'AGE', next: ['FIND_AGE'], prev: null, level: 0, type: 'root' },
  FIND_AGE: {
    key: 'FIND_AGE',
    next: ['GET_ACTUAL_AGE'],
    prev: 'AGE',
    level: 1,
    type: 'branch'
  },
  GET_ACTUAL_AGE: {
    key: 'GET_ACTUAL_AGE',
    next: ['PRINT'],
    prev: 'FIND_AGE',
    level: 2,
    type: 'branch'
  },
  PRINT: {
    key: 'PRINT',
    next: [],
    prev: 'GET_ACTUAL_AGE',
    level: 3,
    type: 'leaf'
  }
});

__qvr.func['AGE'] = async (value, key, prev, next) => {
  return { birthDate: new Date(value), today: new Date() };
};
__qvr.func['FIND_AGE'] = async (value, key, prev, next) => {
  const { today, birthDate } = value;
  const age = today.getYear() - birthDate.getYear();
  const month = today.getMonth() - birthDate.getMonth();
  return { age, month };
};
__qvr.func['GET_ACTUAL_AGE'] = async (value, key, prev, next) => {
  const { age, month } = value;
  return month < 0 || (month === 0 && today.getDate() < birthDate.getDate())
    ? age - 1
    : age;
};
__qvr.func['PRINT'] = async (value, key, prev, next) => {
  __qvr.log(value);
};
export default value => {
  __qvr.setRoot(__qvr.nodes['AGE'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root, value);
};
