import { Quiver } from './qvr/qvr.js'
const qvr = new Quiver();
qvr.setNodes({"hello":{"key":"hello","next":["sp"],"prev":null,"level":0,"type":"root"},"sp":{"key":"sp","next":["world"],"prev":"hello","level":1,"type":"branch"},"world":{"key":"world","next":["!","goTo"],"prev":"sp","level":2,"type":"branch"},"!":{"key":"!","next":[],"prev":"world","level":3,"type":"leaf"},"goTo":{"key":"goTo","next":[],"prev":"world","level":3,"type":"leaf"},"result":{"key":"result","next":[],"prev":"goTo","level":0,"type":"root"}});
qvr.func["hello"] = async (value, key, prev, next) => {
return "Hello"
}
qvr.func["sp"] = async (value, key, prev, next) => {
return value + " "
}
qvr.func["world"] = async (value, key, prev, next) => {
return value + "World"
}
qvr.func["!"] = async (value, key, prev, next) => {
return value + "!"
}
qvr.func["goTo"] = async (value, key, prev, next) => {
return value + " " + await qvr.goTo("result", 2) && qvr.goTo("log", 3)
}
qvr.func["result"] = async (value, key, prev, next) => {
return value + 1
};
export default async (logging = false) => {
qvr.logOn = logging;
qvr.setRoot(qvr.nodes["hello"].key);
qvr.reset();
await qvr.goTo(qvr.root);
return qvr.out();
}