import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":["MAIN"],"prev":null,"level":0,"group":0,"type":"root"},"MAIN":{"key":"MAIN","next":["FIZZ_BUZZ"],"prev":"TEST","level":1,"group":0,"type":"branch"},"FIZZ_BUZZ":{"key":"FIZZ_BUZZ","next":["fn[0]"],"prev":"MAIN","level":2,"group":0,"type":"branch"},"fn[0]":{"key":"fn[0]","next":["fn[1]","fn[2]","fn[3]","fn[4]"],"prev":"FIZZ_BUZZ","level":3,"group":0,"type":"branch"},"fn[1]":{"key":"fn[1]","next":[],"prev":"fn[0]","level":4,"group":0,"type":"leaf"},"fn[2]":{"key":"fn[2]","next":[],"prev":"fn[0]","level":4,"group":0,"type":"leaf"},"fn[3]":{"key":"fn[3]","next":[],"prev":"fn[0]","level":4,"group":0,"type":"leaf"},"fn[4]":{"key":"fn[4]","next":[],"prev":"fn[0]","level":4,"group":0,"type":"leaf"},"TWO_SUM":{"key":"TWO_SUM","next":[],"prev":null,"level":0,"group":1,"type":"root"},"OUT":{"key":"OUT","next":[],"prev":null,"level":0,"group":2,"type":"root"},"DESCRIPTION":{"key":"DESCRIPTION","next":[],"prev":null,"level":0,"group":3,"type":"root"},"EXIT":{"key":"EXIT","next":[],"prev":null,"level":0,"group":4,"type":"root"}});

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

quiv.log(quiv.sync("TWO_SUM")({ nums: [-3, 4, 3, 90], target: 0 }))
return true
}
quiv.fn["MAIN"] = (value, key, prev, next) => {
return quiv.log(quiv.nodes)
}
quiv.fn["FIZZ_BUZZ"] = (value, key, prev, next) => {
return 250
}
quiv.fn["fn[0]"] = (value, key, prev, next) => {
return {
"number": value,
"when": [+(value % 15 === 0), +(value % 3 === 0), +(value % 5 === 0)]
}
}
quiv.fn["fn[1]"] = (value, key, prev, next) => {
if(![{ "when": [1, 1, 1] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return quiv.log("FizzBuzz")
}
quiv.fn["fn[2]"] = (value, key, prev, next) => {
if(![{ "when": [0, 1, 0] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return quiv.log("Fizz")
}
quiv.fn["fn[3]"] = (value, key, prev, next) => {
if(![{ "when": [0, 0, 1] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return quiv.log("Buzz")
}
quiv.fn["fn[4]"] = (value, key, prev, next) => {
const { number } = value;
if(![{ "when": [0, 0, 0] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return quiv.log(number)
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