import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"OUT":{"key":"OUT","next":[],"prev":null,"level":0,"type":"root"},"RECURSION":{"key":"RECURSION","next":["ADD_TIMES"],"prev":null,"level":0,"type":"root"},"ADD_TIMES":{"key":"ADD_TIMES","next":[],"prev":"RECURSION","level":1,"type":"leaf"}});

quiv.arrows["OUT"] = async (value, key, prev, next) => {
return quiv.log(
(  await  quiv.go("RECURSION")
({number: 5, val: 10, n: 5 }))
["ADD_TIMES"]
)
}
quiv.arrows["RECURSION"] = (value, key, prev, next) => {
return { ...value, count: !value.count ? 0 : value.count }
}
quiv.arrows["ADD_TIMES"] = async (value, key, prev, next) => {
const {number,n,val,count} = value;

return n > value.count ?
(  await  quiv.go("RECURSION")
({ number: number * val, count: ++value.count, val, n }))
["ADD_TIMES"] :
number
};
export default (value) => {
quiv.setRoot(quiv.nodes["OUT"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}