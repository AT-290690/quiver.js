import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"start":{"key":"start","next":[],"prev":null,"level":0,"group":0,"type":"root"},"a":{"key":"a","next":[],"prev":null,"level":0,"group":1,"type":"root"},"g":{"key":"g","next":["m","l","b"],"prev":null,"level":0,"group":2,"type":"root"},"m":{"key":"m","next":[],"prev":"g","level":1,"group":2,"type":"leaf"},"l":{"key":"l","next":[],"prev":"g","level":1,"group":2,"type":"leaf"},"b":{"key":"b","next":["c"],"prev":"g","level":1,"group":2,"type":"branch"},"c":{"key":"c","next":["d"],"prev":"b","level":2,"group":2,"type":"branch"},"d":{"key":"d","next":["e","asad"],"prev":"c","level":3,"group":2,"type":"branch"},"e":{"key":"e","next":[],"prev":"d","level":4,"group":2,"type":"leaf"},"asad":{"key":"asad","next":[],"prev":"d","level":4,"group":2,"type":"leaf"}});

quiv.fn["start"] = (value, key, prev, next) => {
const traces = [quiv.trace("g","e"), quiv.trace("g","l"),quiv.trace("b","asad")]
const paths = traces.map((t) => quiv.path(t))
quiv.log(quiv.sync("g")(5))
quiv.log(paths[0].sync("g")(5))

quiv.log(paths[0].dfsSync("g", 25))
quiv.log(paths[1].dfsSync("g", 15))
quiv.log(paths[2].dfsSync("b", 13))

}
quiv.fn["a"] = (value, key, prev, next) => {
return value
}
quiv.fn["g"] = (value, key, prev, next) => {
return value
}
quiv.fn["m"] = (value, key, prev, next) => {
return value + 15
}
quiv.fn["l"] = (value, key, prev, next) => {
return value - 25
}
quiv.fn["b"] = (value, key, prev, next) => {
return value * 2
}
quiv.fn["c"] = (value, key, prev, next) => {
return value + 3
}
quiv.fn["d"] = (value, key, prev, next) => {
return value + 3
}
quiv.fn["e"] = (value, key, prev, next) => {
return value + 5
}
quiv.fn["asad"] = (value, key, prev, next) => {
return value * 5
};
export default (value) => {
quiv.setRoot(quiv.nodes["start"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}