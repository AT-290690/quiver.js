import { Quiver } from '../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({"MAIN":{"key":"MAIN","next":[],"prev":null,"level":0,"type":"root"},"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"type":"root"},"TWO_SUM":{"key":"TWO_SUM","next":["OUT"],"prev":null,"level":0,"type":"root"},"OUT":{"key":"OUT","next":[],"prev":"TWO_SUM","level":1,"type":"leaf"}});
const NODES = __qvr.nodes;
const MEMO = {};
__qvr.func["MAIN"] = async (VALUE, KEY, PREV, NEXT) => {
return __qvr.test.setup("TEST")
}
__qvr.func["TEST"] = async (VALUE, KEY, PREV, NEXT) => {
const { test } = __qvr

await test.
root("TWO_SUM").input({ nums: [2, 7, 11, 15], target: 9 })
.leaf("OUT").output([0, 1])
.should("Return correct sum")

await test.
root("TWO_SUM").input({ nums: [3, 2, 4], target: 6 })
.leaf("OUT").output([1, 2])
.should("Return correct sum")

await test.
root("TWO_SUM").input({ nums: [3, 3], target: 6 })
.leaf("OUT").output([0, 1])
.should("Return correct sum")

await test.
root("TWO_SUM").input({ nums: [-3, 4, 3, 90], target: 0 })
.leaf("OUT").output([0, 2])
.should("Return correct sum")

console.log(await __qvr.go("TWO_SUM")({ nums: [-3, 4, 3, 90], target: 0 }))

}
__qvr.func["TWO_SUM"] = async (VALUE, KEY, PREV, NEXT) => {
const { nums, target } = VALUE
/*
Iterate the numbers and store diff from
target as key of the dictionary
*/
return { nums, dict: nums.reduce((acc, item, index) => {
const key = target - nums[index]
acc[key] = index
return acc
}, {}) }

}
__qvr.func["OUT"] = async (VALUE, KEY, PREV, NEXT) => {
const { nums, dict } = VALUE
/*
Access dictionary and push indexes in
output array
*/
return nums.reduce((acc, item, index) => {
const key = nums[index]
if (dict[key] !== undefined && dict[key] !== index) {
acc.push(index)
dict[key] = index // in case of a duplicate
}
return acc
}, [])
};
export default () => {
__qvr.setRoot(__qvr.nodes["MAIN"].key);
__qvr.reset();
__qvr.goTo(__qvr.root);
}