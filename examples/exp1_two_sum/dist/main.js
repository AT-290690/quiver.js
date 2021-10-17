import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  TEST: { key: 'TEST', next: [], prev: null, level: 0, type: 'root' },
  TWO_SUM: {
    key: 'TWO_SUM',
    next: ['OUT'],
    prev: null,
    level: 0,
    type: 'root'
  },
  OUT: { key: 'OUT', next: [], prev: 'TWO_SUM', level: 1, type: 'leaf' }
});
/* 
Example 1
Solving two sum problem
and demonstrating graph testing
*/

__qvr.func['TEST'] = async (value, key, prev, next) => {
  await __qvr.test
    .root('TWO_SUM')
    .input({ nums: [2, 7, 11, 15], target: 9 })
    .leaf('OUT')
    .output([0, 1])
    .should('Return correct sum');

  await __qvr.test
    .root('TWO_SUM')
    .input({ nums: [3, 2, 4], target: 6 })
    .leaf('OUT')
    .output([1, 2])
    .should('Return correct sum');

  await __qvr.test
    .root('TWO_SUM')
    .input({ nums: [3, 3], target: 6 })
    .leaf('OUT')
    .output([0, 1])
    .should('Return correct sum');

  await __qvr.test
    .root('TWO_SUM')
    .input({ nums: [-3, 4, 3, 90], target: 0 })
    .leaf('OUT')
    .output([0, 2])
    .should('Return correct sum');

  __qvr.log(await __qvr.go('TWO_SUM')({ nums: [-3, 4, 3, 90], target: 0 }));
};
__qvr.func['TWO_SUM'] = async (value, key, prev, next) => {
  const { nums, target } = value;
  /*
Iterate the numbers and store diff from
target as key of the dictionary
*/
  return {
    nums,
    dict: nums.reduce((acc, item, index) => {
      const key = target - nums[index];
      acc[key] = index;
      return acc;
    }, {})
  };
};
__qvr.func['OUT'] = async (value, key, prev, next) => {
  const { nums, dict } = value;
  /*
Access dictionary and push indexes in
output array
*/
  return nums.reduce((acc, item, index) => {
    const key = nums[index];
    if (dict[key] !== undefined && dict[key] !== index) {
      acc.push(index);
      dict[key] = index; // in case of a duplicate
    }
    return acc;
  }, []);
};
export default () => {
  __qvr.setRoot(__qvr.nodes['TEST'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
