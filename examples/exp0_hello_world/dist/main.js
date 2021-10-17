import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"HELLO":{"key":"HELLO","next":["SPACE"],"prev":null,"level":0,"type":"root"},"SPACE":{"key":"SPACE","next":["WORLD"],"prev":"HELLO","level":1,"type":"branch"},"WORLD":{"key":"WORLD","next":["!"],"prev":"SPACE","level":2,"type":"branch"},"!":{"key":"!","next":["PRINT"],"prev":"WORLD","level":3,"type":"branch"},"PRINT":{"key":"PRINT","next":[],"prev":"!","level":4,"type":"leaf"}});
/* 
Example 0
Demonstrating simple hello world program
*/

quiv.func["HELLO"] = async (value, key, prev, next) => {
return "Hello"
}
quiv.func["SPACE"] = async (value, key, prev, next) => {
return value + " "
}
quiv.func["WORLD"] = async (value, key, prev, next) => {
return value + "World"
}
quiv.func["!"] = async (value, key, prev, next) => {
return value + "!"
}
quiv.func["PRINT"] = async (value, key, prev, next) => {
return quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["HELLO"].key);
quiv.reset();
quiv.goTo(quiv.root, value);
}