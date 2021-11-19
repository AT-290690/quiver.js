import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"group":0,"index":-1,"type":"root"},"LAST":{"key":"LAST","next":["fn[0]","fn[1]","fn[2]"],"prev":null,"level":0,"group":1,"index":-1,"type":"root"},"fn[0]":{"key":"fn[0]","next":[],"prev":"LAST","level":1,"group":1,"index":0,"type":"leaf"},"fn[1]":{"key":"fn[1]","next":[],"prev":"LAST","level":1,"group":1,"index":1,"type":"leaf"},"fn[2]":{"key":"fn[2]","next":[],"prev":"LAST","level":1,"group":1,"index":2,"type":"leaf"}});

quiv.fn["TEST"] = (value, key, prev, next, index) => {


const result = quiv.sync("LAST")([1,2,3])
quiv.log(result)
}
quiv.fn["LAST"] = (value, key, prev, next, index) => {

return value
}
quiv.fn["fn[0]"] = (value, key, prev, next, index) => {
if(![[]].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) {
return undefined;
};
return null
}
quiv.fn["fn[1]"] = (value, key, prev, next, index) => {
const [first] = value;
if(![[first]].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }))) {
return undefined;
};
return first
}
quiv.fn["fn[2]"] = (value, key, prev, next, index) => {
const [first, ...rest] = value;
if(![[] , [first]].every((predicate) => !quiv.test.isEqual(predicate, value, { partial: true }))) {
      return undefined;
};

return quiv.fn["LAST"](rest)
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}