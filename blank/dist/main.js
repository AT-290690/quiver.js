import { Quiver } from '../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"group":0,"type":"root"},"LONGEST_PALIDROMIC_SUBSTRING":{"key":"LONGEST_PALIDROMIC_SUBSTRING","next":["fn[0]"],"prev":null,"level":0,"group":1,"type":"root"},"fn[0]":{"key":"fn[0]","next":["fn[1]"],"prev":"LONGEST_PALIDROMIC_SUBSTRING","level":1,"group":1,"type":"branch"},"fn[1]":{"key":"fn[1]","next":["OUTPUT"],"prev":"fn[0]","level":2,"group":1,"type":"branch"},"OUTPUT":{"key":"OUTPUT","next":[],"prev":"fn[1]","level":3,"group":1,"type":"leaf"},"DFS":{"key":"DFS","next":["fn[2]"],"prev":null,"level":0,"group":2,"type":"root"},"fn[2]":{"key":"fn[2]","next":["fn[3]"],"prev":"DFS","level":1,"group":2,"type":"branch"},"fn[3]":{"key":"fn[3]","next":[],"prev":"fn[2]","level":2,"group":2,"type":"leaf"}});
/*
 yarn quiv - to compile
 node ./blank/dist/main.js - to start
 write code below
*/
/*
Input: s = "babad"
	Output: "bab"
	Note: "aba" is also a valid answer.
*/

quiv.fn["TEST"] = (value, key, prev, next) => {
const { tree } = quiv.test
tree("LONGEST_PALIDROMIC_SUBSTRING")
.input({ str: "a" })
.output({ "OUTPUT": "a" })
.should("Return longest palidromic substring")

tree("LONGEST_PALIDROMIC_SUBSTRING")
.input({ str: "babad" })
.output({ "OUTPUT": "aba" })
.should("Return longest palidromic substring")

}
quiv.fn["LONGEST_PALIDROMIC_SUBSTRING"] = (value, key, prev, next) => {
const { str } = value;
return {
str,
len: str.length,
allSame: +[...str].every(s => s === str[0]),
firstAndLastSame: +str[0] === str[str.length - 1]
}
}
quiv.fn["fn[0]"] = (value, key, prev, next) => {
const { str } = value;
if(![{ len: 0 } , { len: 1 } , { len: 2, allSame: 1 } , { len: 3, firstAndLastSame: 1 }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return { base: true, str }
}
quiv.fn["fn[1]"] = (value, key, prev, next) => {
const { base, str } = value;
return base ? str : quiv.dfs("DFS")({ acc: '', str, index: Math.floor(str.length/2) })
}
quiv.fn["OUTPUT"] = (value, key, prev, next) => {
return quiv.log(value) ?? value

}
quiv.fn["DFS"] = (value, key, prev, next) => {
return {
str, index, acc,
palidromic: (str[index - 1] === str[index + 1])
}
}
quiv.fn["fn[2]"] = (value, key, prev, next) => {
if(![{ palidromic: true }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) return undefined;
return {
acc: (str[index - 1] ?? '')  + str + (str[index + 1] ?? ''),
str,
index: index + 1
}
}
quiv.fn["fn[3]"] = (value, key, prev, next) => {
return quiv.dfs("DFS")(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.dfsAsync(quiv.root, value);
}