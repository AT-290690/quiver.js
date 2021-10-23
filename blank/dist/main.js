import { Quiver } from '../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"TEST":{"key":"TEST","next":[],"prev":null,"level":0,"type":"root"},"BEFORE_START":{"key":"BEFORE_START","next":["START"],"prev":null,"level":0,"type":"root"},"START":{"key":"START","next":["MID"],"prev":"BEFORE_START","level":1,"type":"branch"},"MID":{"key":"MID","next":["END"],"prev":"START","level":2,"type":"branch"},"END":{"key":"END","next":[],"prev":"MID","level":3,"type":"leaf"}});
/*
 yarn qvr - to compile
 node ./blank/dist/main.js - to start
 write code below
*/

quiv.arrows["TEST"] = (value, key, prev, next) => {
const { root } = quiv.test()

root('BEFORE_START')
.input(4)
.leaf('END')
.output(10)
.should('Do math stuff')


}
quiv.arrows["BEFORE_START"] = (value, key, prev, next) => {
return value === void 0 ?
void 0 : !(typeof value === 'number' && value <= 10 && value >= 3) ?
void 0 : value
}
quiv.arrows["START"] = async (value, key, prev, next) => {
return void(value + 1)
}
quiv.arrows["MID"] = (value, key, prev, next) => {
return value + 5
}
quiv.arrows["END"] = (value, key, prev, next) => {
return value * 2
};
export default (value) => {
quiv.setRoot(quiv.nodes["TEST"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}