import { Quiver } from '../../../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({
  TEST: { key: 'TEST', next: [], prev: null, level: 0, type: 'root' },
  TWO_SUM: {
    key: 'TWO_SUM',
    next: ['OUT', 'DESC', 'EXIT'],
    prev: null,
    level: 0,
    type: 'root'
  },
  OUT: { key: 'OUT', next: [], prev: 'TWO_SUM', level: 1, type: 'leaf' },
  DESC: { key: 'DESC', next: [], prev: 'TWO_SUM', level: 1, type: 'leaf' },
  EXIT: { key: 'EXIT', next: [], prev: 'TWO_SUM', level: 1, type: 'leaf' }
});
/* 
Example 1
Solving two sum problem
and demonstrating graph testing
*/

__qvr.func['TEST'] = async (value, key, prev, next) => {
  const { root, e2e } = __qvr.test();

  __qvr.log(await __qvr.go('TWO_SUM')({ nums: [-3, 4, 3, 90], target: 0 }));

  await root('TWO_SUM')
    .input({ nums: [2, 7, 11, 15], target: 9 })
    .leaf('OUT')
    .output([0, 1])
    .should('Return correct sum');

  await root('TWO_SUM')
    .input({ nums: [3, 2, 4], target: 6 })
    .leaf('OUT')
    .output([1, 2])
    .should('Return correct sum');

  await root('TWO_SUM')
    .input({ nums: [3, 3], target: 6 })
    .leaf('OUT')
    .output([0, 1])
    .should('Return correct sum');

  await root('TWO_SUM')
    .input({ nums: [-3, 4, 3, 90], target: 0 })
    .leaf('OUT')
    .output([0, 2])
    .should('Return correct sum');

  await root('TWO_SUM')
    .input({ nums: [-3, 4, 3, 90], target: 7 })
    .leaf('DESC')
    .output(
      `Solving two sum problem
for numbers ${[-3, 4, 3, 90]}
with target ${7}
and demonstrating graph testing`
    )
    .should('Should print the correct description');

  await e2e('TWO_SUM')
    .input({ nums: [-3, 4, 3, 90], target: 0 })
    .output({
      OUT: [0, 2],
      DESC: `Solving two sum problem
for numbers ${[-3, 4, 3, 90]}
with target ${0}
and demonstrating graph testing`,
      EXIT: 'Program has stopped!'
    })
    .should('E2E - Return the correct outputs');
};
__qvr.func['TWO_SUM'] = async (value, key, prev, next) => {
  const { nums, target } = value;
  /*
Iterate the numbers and store diff from
target as key of the dictionary
*/
  return {
    nums,
    target,
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
__qvr.func['DESC'] = async (value, key, prev, next) => {
  return `Solving two sum problem
for numbers ${value.nums}
with target ${value.target}
and demonstrating graph testing`;
};
__qvr.func['EXIT'] = async (value, key, prev, next) => {
  return 'Program has stopped!';
};
export default () => {
  __qvr.setRoot(__qvr.nodes['TEST'].key);
  __qvr.reset();
  __qvr.goTo(__qvr.root);
};
