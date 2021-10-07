import { Quiver } from './qvr/qvr.js'
const qvr = new Quiver();
qvr.setNodes({"hello":{"key":"hello","next":["sp"],"prev":null,"level":0,"type":"root"},"sp":{"key":"sp","next":["world"],"prev":"hello","level":1,"type":"branch"},"world":{"key":"world","next":["!","goTo"],"prev":"sp","level":2,"type":"branch"},"!":{"key":"!","next":[],"prev":"world","level":3,"type":"leaf"},"goTo":{"key":"goTo","next":[],"prev":"world","level":3,"type":"leaf"},"result":{"key":"result","next":["out"],"prev":"goTo","level":0,"type":"root"},"out":{"key":"out","next":[],"prev":"result","level":1,"type":"leaf"},"log":{"key":"log","next":[],"prev":"out","level":0,"type":"root"}});
qvr.func["hello"] = async (__value, __key, __prev, __next) => {
return "Hello"
}
qvr.func["sp"] = async (__value, __key, __prev, __next) => {
return __value + " "
}
qvr.func["world"] = async (__value, __key, __prev, __next) => {
return __value + "World"
}
qvr.func["!"] = async (__value, __key, __prev, __next) => {
return __value + "!"
}
qvr.func["goTo"] = async (__value, __key, __prev, __next) => {
return __value + " " + await qvr.goTo("result", 2) && qvr.goTo("log", 3) && qvr.visit("log")
}
qvr.func["result"] = async (__value, __key, __prev, __next) => {
return { x: __value + 1, y: 13 }
}
qvr.func["out"] = async (__value, __key, __prev, __next) => {
const { x, y } = __value
qvr.goTo("log",6) // blocked!
return x * y
}
qvr.func["log"] = async (__value, __key, __prev, __next) => {
return console.log(__value) || __value
};
export default async (logging = false) => {
qvr.logOn = logging;
qvr.setRoot(qvr.nodes["hello"].key);
qvr.reset();
await qvr.goTo(qvr.root);
return qvr.out();
}