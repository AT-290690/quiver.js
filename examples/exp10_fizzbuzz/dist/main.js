import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":["INPUT"],"prev":null,"level":0,"group":0,"index":-1,"type":"root"},"INPUT":{"key":"INPUT","next":["fn[0]"],"prev":"TEST","level":1,"group":0,"index":0,"type":"branch"},"fn[0]":{"key":"fn[0]","next":["FIZZBUZZ","FIZZ","BUZZ","ELSE"],"prev":"INPUT","level":2,"group":0,"index":0,"type":"branch"},"FIZZBUZZ":{"key":"FIZZBUZZ","next":[],"prev":"fn[0]","level":3,"group":0,"index":0,"type":"leaf"},"FIZZ":{"key":"FIZZ","next":[],"prev":"fn[0]","level":3,"group":0,"index":1,"type":"leaf"},"BUZZ":{"key":"BUZZ","next":[],"prev":"fn[0]","level":3,"group":0,"index":2,"type":"leaf"},"ELSE":{"key":"ELSE","next":[],"prev":"fn[0]","level":3,"group":0,"index":3,"type":"leaf"}});

quiv.fn["TEST"] = (value, key, prev, next, index) => {


const { tree, root } = quiv.test

tree("INPUT")
.input(1)
.output({"ELSE": 1})
.should("Return number")

tree("INPUT")
.input(3)
.output({"FIZZ": "Fizz"})
.should("Return Fizz")

tree("INPUT")
.input(5)
.output({"BUZZ": "Buzz"})
.should("Return Buzz")

tree("INPUT")
.input(15)
.output({"FIZZBUZZ": "FizzBuzz"})
.should("Return FizzBuzz")

root("INPUT")
.input(15)
.leaf("FIZZBUZZ")
.output( "FizzBuzz")
.should("Return FizzBuzz")

root("INPUT")
.input(6)
.leaf("FIZZ")
.output( "Fizz")
.should("Return Fizz")

}
quiv.fn["INPUT"] = (value, key, prev, next, index) => {

return value
}
quiv.fn["fn[0]"] = (value, key, prev, next, index) => {

return {
number: value,
predicate: [
+(value % 15 === 0),
+(value % 3 === 0),
+(value % 5 === 0)
]
}
}
quiv.fn["FIZZBUZZ"] = (value, key, prev, next, index) => {
if(![{ predicate: [1, 1, 1] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) {
return undefined;
};
return "FizzBuzz"
}
quiv.fn["FIZZ"] = (value, key, prev, next, index) => {
if(![{ predicate: [0, 1, 0] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) {
return undefined;
};
return "Fizz"
}
quiv.fn["BUZZ"] = (value, key, prev, next, index) => {
if(![{ predicate: [0, 0, 1] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) {
return undefined;
};
return "Buzz"
}
quiv.fn["ELSE"] = (value, key, prev, next, index) => {
const { number } = value;
if(![{ predicate: [1, 1, 1] } , { predicate: [0, 1, 0] } , { predicate: [0, 0, 1] }].every((predicate) => !quiv.test.isEqual(predicate, value, { partial: true }))) {
      return undefined;
};
return number
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}