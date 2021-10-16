import { Quiver } from '../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({"MAIN":{"key":"MAIN","next":[],"prev":null,"level":0,"type":"root"},"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"type":"root"},"START":{"key":"START","next":["END","AA1","TO_ARRAY","TO_NUMBER","TO_BOOLEAN"],"prev":null,"level":0,"type":"root"},"END":{"key":"END","next":[],"prev":"START","level":1,"type":"leaf"},"AA1":{"key":"AA1","next":["BB"],"prev":"START","level":1,"type":"branch"},"BB":{"key":"BB","next":[],"prev":"AA1","level":2,"type":"leaf"},"TO_ARRAY":{"key":"TO_ARRAY","next":["ARRAY"],"prev":"START","level":1,"type":"branch"},"ARRAY":{"key":"ARRAY","next":[],"prev":"TO_ARRAY","level":2,"type":"leaf"},"TO_NUMBER":{"key":"TO_NUMBER","next":[],"prev":"START","level":1,"type":"leaf"},"TO_BOOLEAN":{"key":"TO_BOOLEAN","next":[],"prev":"START","level":1,"type":"leaf"}});
const NODES = __qvr.nodes;
const MEMO = {};
__qvr.func["MAIN"] = async (VALUE, KEY, PREV, NEXT) => {
return __qvr.test.setup("TEST")
}
__qvr.func["TEST"] = async (VALUE, KEY, PREV, NEXT) => {
const { test } = __qvr

await test.
root("START").with(5)
.leaf("TO_NUMBER").with(500)
.should("Return correct number")

await test.
root("START").with(2)
.leaf("TO_BOOLEAN").with(true)
.should("Return correct boolean")

await test.
root("START").with(10)
.leaf("END").with({"b":20,"c":0,"a":10})
.should("Return correct object")

await test.
root("START").with(10)
.leaf("BB").with({"b":120,"c":20,"a":10,"x":100})
.should("Return correct object")

await test.
root("START").with(10)
.leaf("ARRAY").with([20, 0, 10])
.should("Return correct array")

}
__qvr.func["START"] = async (VALUE, KEY, PREV, NEXT) => {
return { a: VALUE }
}
__qvr.func["END"] = async (VALUE, KEY, PREV, NEXT) => {
return { b: VALUE.a * 2 , c: VALUE.a - 10, ...VALUE }
}
__qvr.func["AA1"] = async (VALUE, KEY, PREV, NEXT) => {
return { b: VALUE.a * 12 , c: VALUE.a + 10, ...VALUE }
}
__qvr.func["BB"] = async (VALUE, KEY, PREV, NEXT) => {
return { ...VALUE, x: 100 }
}
__qvr.func["TO_ARRAY"] = async (VALUE, KEY, PREV, NEXT) => {
return { b: VALUE.a * 2 , c: VALUE.a - 10, ...VALUE }
}
__qvr.func["ARRAY"] = async (VALUE, KEY, PREV, NEXT) => {
return Object.values(VALUE)
}
__qvr.func["TO_NUMBER"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE.a * 100
}
__qvr.func["TO_BOOLEAN"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE.a % 2 === 0

};
export default () => {
__qvr.setRoot(__qvr.nodes["MAIN"].key);
__qvr.reset();
__qvr.goTo(__qvr.root);
}