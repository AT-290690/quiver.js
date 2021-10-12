import { Quiver } from '../quiver/quiver.js';
const __qvr = new Quiver();
__qvr.setNodes({"hello":{"key":"hello","next":["SPACE"],"prev":null,"level":0,"type":"root"},"SPACE":{"key":"SPACE","next":["world"],"prev":"hello","level":1,"type":"branch"},"world":{"key":"world","next":["!","goTo"],"prev":"SPACE","level":2,"type":"branch"},"!":{"key":"!","next":[],"prev":"world","level":3,"type":"leaf"},"goTo":{"key":"goTo","next":[],"prev":"world","level":3,"type":"leaf"},"result":{"key":"result","next":["out","log"],"prev":null,"level":0,"type":"root"},"out":{"key":"out","next":[],"prev":"result","level":1,"type":"leaf"},"log":{"key":"log","next":[],"prev":"result","level":1,"type":"leaf"},"keys":{"key":"keys","next":[],"prev":null,"level":0,"type":"root"}});
const NODES = __qvr.nodes;
const MEMO = {};
__qvr.func["hello"] = async (VALUE, KEY, PREV, NEXT) => {
return "Hello"
}
__qvr.func["SPACE"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + " "
}
__qvr.func["world"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + "World"
}
__qvr.func["!"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + "!"
}
__qvr.func["goTo"] = async (VALUE, KEY, PREV, NEXT) => {
return VALUE + " " + await __qvr.go("result")(2)
}
__qvr.func["result"] = async (VALUE, KEY, PREV, NEXT) => {
return { x: VALUE + 1, y: 13 }
}
__qvr.func["out"] = async (VALUE, KEY, PREV, NEXT) => {
const { x } = VALUE
MEMO["date"] = new Date()
await __qvr.go("log")(await __qvr.go('keys')())
return x * VALUE.y
}
__qvr.func["log"] = async (VALUE, KEY, PREV, NEXT) => {
return console.log(VALUE)
}
__qvr.func["keys"] = async (VALUE, KEY, PREV, NEXT) => {
return Object.keys(NODES)
};
export default async (logging = false) => {
__qvr.logOn = logging;
__qvr.setRoot(__qvr.nodes["hello"].key);
__qvr.reset();
await __qvr.goTo(__qvr.root);
return __qvr.out();
}