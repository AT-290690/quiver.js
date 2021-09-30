import { Quiver } from './qvr/qvr.js'
const qvr = new Quiver();
qvr.setNodes({"hello":{"key":"hello","next":["sp"],"prev":null,"level":0,"type":"root"},"sp":{"key":"sp","next":["world"],"prev":"hello","level":1,"type":"branch"},"world":{"key":"world","next":["!"],"prev":"sp","level":2,"type":"branch"},"!":{"key":"!","next":[],"prev":"world","level":3,"type":"leaf"}});
qvr.func["hello"] = async (value, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return "Hello"
}
qvr.func["sp"] = async (value, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return value + " "
}
qvr.func["world"] = async (value, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return value + "World"
}
qvr.func["!"] = async (value, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return value + "!"
};
export default async () => {
  qvr.setRoot(qvr.nodes["hello"].key);
  qvr.reset();
  await qvr.goTo(qvr.root);
  return qvr.out();
}