import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"HELLO":{"key":"HELLO","next":["SPACE"],"prev":null,"level":0,"group":0,"type":"root"},"SPACE":{"key":"SPACE","next":["WORLD"],"prev":"HELLO","level":1,"group":0,"type":"branch"},"WORLD":{"key":"WORLD","next":["!"],"prev":"SPACE","level":2,"group":0,"type":"branch"},"!":{"key":"!","next":["PRINT"],"prev":"WORLD","level":3,"group":0,"type":"branch"},"PRINT":{"key":"PRINT","next":[],"prev":"!","level":4,"group":0,"type":"leaf"}});
/* 
Example 0
Demonstrating simple hello world program
*/

quiv.fn["HELLO"] = (value, key, prev, next) => {
return "Hello"
}
quiv.fn["SPACE"] = (value, key, prev, next) => {
return value + " "
}
quiv.fn["WORLD"] = (value, key, prev, next) => {
return value + "World"
}
quiv.fn["!"] = (value, key, prev, next) => {
return value + "!"
}
quiv.fn["PRINT"] = (value, key, prev, next) => {
return quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["HELLO"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}