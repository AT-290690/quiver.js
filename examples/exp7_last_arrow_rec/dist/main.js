import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"group":0,"index":-1,"type":"root"},"LAST":{"key":"LAST","next":["fn_0","fn_1","fn_2"],"prev":null,"level":0,"group":1,"index":-1,"type":"root"},"fn_0":{"key":"fn_0","next":[],"prev":"LAST","level":1,"group":1,"index":0,"type":"leaf"},"fn_1":{"key":"fn_1","next":[],"prev":"LAST","level":1,"group":1,"index":1,"type":"leaf"},"fn_2":{"key":"fn_2","next":[],"prev":"LAST","level":1,"group":1,"index":2,"type":"leaf"}});

quiv.fn["TEST"] = (value, key, prev, next, index) => {


const result = quiv.sync("LAST")([1, 2, 3, 4, 5, 6])
quiv.log(result)
}
quiv.fn["LAST"] = (value, key, prev, next, index) => {

return value
}
quiv.fn["fn_0"] = (value, key, prev, next, index) => {
if(![[]].some((predicate) => quiv.test.isEqual(predicate, value, { partial: false }))) {
return undefined;
};
return null
}
quiv.fn["fn_1"] = (value, key, prev, next, index) => {
const [first] = value;
if(![[first]].some((predicate) => quiv.test.isEqual(predicate, value, { partial: false }))) {
return undefined;
};
return first
}
quiv.fn["fn_2"] = (value, key, prev, next, index) => {
const [first, ...rest] = value;
if(![[first]].every((predicate) => !quiv.test.isEqual(predicate, value, { partial: false }))) {
      return undefined;
};
return quiv.sync("LAST")(rest)
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}