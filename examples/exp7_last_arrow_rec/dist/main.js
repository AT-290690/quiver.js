import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"START":{"key":"START","next":[],"prev":null,"level":0,"group":0,"type":"root"},"LAST":{"key":"LAST","next":[],"prev":null,"level":0,"group":1,"type":"root"}});

quiv.fn["START"] = async (value, key, prev, next) => {
const result =  await  quiv.go("LAST")([1, 2, 3])
quiv.log(result)

}
quiv.fn["LAST"] = (value, key, prev, next) => {
const [first,...rest] = value;

if (quiv.test.isEqual(value, [])) return null
if (quiv.test.isEqual(rest, [])) return first
return quiv.fn["LAST"](rest)
};
export default (value) => {
quiv.setRoot(quiv.nodes["START"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}