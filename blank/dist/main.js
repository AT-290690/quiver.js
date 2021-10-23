import { Quiver } from '../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"MAIN":{"key":"MAIN","next":["HELLO"],"prev":null,"level":0,"type":"root"},"HELLO":{"key":"HELLO","next":["LOG"],"prev":"MAIN","level":1,"type":"branch"},"LOG":{"key":"LOG","next":[],"prev":"HELLO","level":2,"type":"leaf"}});
/*
 yarn quiv - to compile
 node ./blank/dist/main.js - to start
 write code below
*/

quiv.arrows["MAIN"] = (value, key, prev, next) => {
return { name: 'Quiver' }
}
quiv.arrows["HELLO"] = (value, key, prev, next) => {
const {name} = value;
return `Hello world, this program is written in ${name}`
}
quiv.arrows["LOG"] = (value, key, prev, next) => {
return quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["MAIN"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}