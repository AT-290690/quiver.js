import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"group":0,"pass":false,"type":"root"},"TWO_SUM":{"key":"TWO_SUM","next":["OUT","DESCRIPTION","EXIT"],"prev":null,"level":0,"group":1,"pass":false,"type":"root"},"OUT":{"key":"OUT","next":[],"prev":"TWO_SUM","level":1,"group":1,"pass":false,"type":"leaf"},"DESCRIPTION":{"key":"DESCRIPTION","next":[],"prev":"TWO_SUM","level":1,"group":1,"pass":false,"type":"leaf"},"EXIT":{"key":"EXIT","next":[],"prev":"TWO_SUM","level":1,"group":1,"pass":false,"type":"leaf"}});
/* 
Example 1
Solving two sum problem
and demonstrating graph testing
*/

quiv.fn["TEST"] = (value, key, prev, next) => {


const { root, tree } = quiv.test

root("TWO_SUM")
.input({ nums: [2, 7, 11, 15], target: 9 })
.leaf("OUT")
.output([0, 1])
.should("Return correct sum")

root("TWO_SUM")
.input({ nums: [3, 2, 4], target: 6 })
.leaf("OUT")
.output([1, 2])
.should("Return correct sum")

root("TWO_SUM")
.input({ nums: [3, 3], target: 6 })
.leaf("OUT")
.output([0, 1])
.should("Return correct sum")

root("TWO_SUM")
.input({ nums: [-3, 4, 3, 90], target: 0 })
.leaf("OUT")
.output([0, 2])
.should("Return correct sum")

root("TWO_SUM")
.input({ nums: [-3, 4, 3, 90], target: 7 })
.leaf("DESCRIPTION")
.output(`Solving two sum problem
for numbers ${[-3, 4, 3, 90]}
with target ${7}
and demonstrating graph testing`)
.should("Should print the correct description")

tree("TWO_SUM")
.input({ nums: [-3, 4, 3, 90], target: 0 })
.output({ OUT: [ 0, 2 ], DESCRIPTION: `Solving two sum problem
for numbers ${[-3, 4, 3, 90]}
with target ${0}
and demonstrating graph testing`, EXIT: "Program has stopped!" })
.should("E2E - Return the correct outputs")

quiv.async("TWO_SUM")({ nums: [-3, 4, 3, 90], target: 0 }).then(res => quiv.log(res))

}
quiv.fn["TWO_SUM"] = (value, key, prev, next) => {
const { nums, target } = value;

return {
nums,
target,
dict: nums.reduce((acc, item, index) => {
const key = target - nums[index]
acc[key] = index
return acc
}, {})
}

}
quiv.fn["OUT"] = (value, key, prev, next) => {
const { nums, dict } = value;

return nums.reduce((acc, item, index) => {
const key = nums[index]
if (dict[key] !== undefined && dict[key] !== index) {
acc.push(index)
dict[key] = index // in case of a duplicate
}
return acc
}, [])

}
quiv.fn["DESCRIPTION"] = (value, key, prev, next) => {
const { nums, target } = value;


return `Solving two sum problem
for numbers ${nums}
with target ${target}
and demonstrating graph testing`

}
quiv.fn["EXIT"] = (value, key, prev, next) => {

return "Program has stopped!"
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}