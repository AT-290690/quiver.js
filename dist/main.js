import { Quiver } from '../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({"TEST":{"key":"TEST","next":["ACTION"],"prev":null,"level":0,"type":"root"},"ACTION":{"key":"ACTION","next":[],"prev":"TEST","level":1,"type":"leaf"},"START":{"key":"START","next":["END","AA1"],"prev":null,"level":0,"type":"root"},"END":{"key":"END","next":[],"prev":"START","level":1,"type":"leaf"},"AA1":{"key":"AA1","next":["BB"],"prev":"START","level":1,"type":"branch"},"BB":{"key":"BB","next":[],"prev":"AA1","level":2,"type":"leaf"}});
const NODES = __qvr.nodes;
const MEMO = {};
__qvr.func["TEST"] = async (VALUE, KEY, PREV, NEXT) => {
const fail = (desc, a, b) => console.log('\x1b[31m',  `FAIL: ${desc}`, '\x1b[32m',`\n\tExpected: ${a}`, '\x1b[31m', `\n\tRecieved: ${b}`, '\x1b[0m')
const success = (desc) => console.log('\x1b[32m', `SUCCESS: ${desc}`, '\x1b[0m')
const { output } = __qvr;
const from = (root) => ({ with: (inp) => ({ should: (desc) => ({ at: (a) => ({ toBe: (b) => __qvr.go(root)(inp).then(()=> output[a].result === b ? success(desc) : fail(desc, output[a].result, b))})})})})
return { from, output }
}
__qvr.func["ACTION"] = async (VALUE, KEY, PREV, NEXT) => {
const { from } = VALUE
from("START").with(10)
.should("Return 22 value")
.at("END")
.toBe(23)

}
__qvr.func["START"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE
}
__qvr.func["END"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + 12
}
__qvr.func["AA1"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE * 2
}
__qvr.func["BB"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + 42
};
export default (logging = false) => {
__qvr.logOn = logging;
__qvr.setRoot(__qvr.nodes["TEST"].key);
__qvr.reset();
__qvr.goTo(__qvr.root);
}