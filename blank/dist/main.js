import { Quiver } from '../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"START":{"key":"START","next":[],"prev":null,"level":0,"type":"root"},"LAST":{"key":"LAST","next":[],"prev":null,"level":0,"type":"root"}});
/*
 yarn qvr - to compile
 node ./blank/dist/main.js - to start
 write code below
*/

quiv.arrows["START"] = async (value, key, prev, next) => {
const result =  await  quiv.go("LAST")([])
quiv.log(result)

}
quiv.arrows["LAST"] = (value, key, prev, next) => {
const [first, ...rest] = value
if (quiv.test.isEqual(value, [])) return null
if (quiv.test.isEqual(rest, [])) return first
return quiv.arrows["LAST"](rest)
};
export default (value) => {
quiv.setRoot(quiv.nodes["START"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}