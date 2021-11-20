import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"fn[0]":{"key":"fn[0]","next":[],"prev":null,"level":0,"group":0,"index":-1,"type":"root"}});

quiv.fn["fn[0]"] = (value, key, prev, next, index) => {

return quiv.log("Hello World")
};
export default (value) => {
quiv.setRoot(quiv.nodes["fn[0]"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}