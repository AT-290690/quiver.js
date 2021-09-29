import { Quiver } from './qvr/qvr.js'
const qvr = new Quiver();
qvr.setNodes({"root":{"key":"root","next":["child"],"prev":null,"level":0,"type":"root"},"child":{"key":"child","next":[],"prev":"root","level":1,"type":"leaf"}});
qvr.func["root"] = async (args, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return "Hello"
}
qvr.func["child"] = async (args, key, prev, next, { nodes, memo, visited, visit, ifNotVisited, leave, goTo, setRoot, getRoot, restart, out, shortCircuit, tramp }) => {
return args + " World!"
};
export default async () => {
  qvr.setRoot(qvr.nodes["root"].key);
  qvr.reset();
  await qvr.goTo(qvr.root);
  return qvr.out();
}