import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"GAME_OF_LIFE":{"key":"GAME_OF_LIFE","next":["CONTEXT"],"prev":null,"level":0,"group":0,"pass":false,"type":"root"},"CONTEXT":{"key":"CONTEXT","next":["fn[0]"],"prev":"GAME_OF_LIFE","level":1,"group":0,"pass":false,"type":"branch"},"fn[0]":{"key":"fn[0]","next":["GAME_LOOP"],"prev":"CONTEXT","level":2,"group":0,"pass":false,"type":"branch"},"GAME_LOOP":{"key":"GAME_LOOP","next":["fn[1]"],"prev":"fn[0]","level":3,"group":0,"pass":false,"type":"branch"},"fn[1]":{"key":"fn[1]","next":["fn[2]"],"prev":"GAME_LOOP","level":4,"group":0,"pass":false,"type":"branch"},"fn[2]":{"key":"fn[2]","next":[],"prev":"fn[1]","level":5,"group":0,"pass":false,"type":"leaf"},"RULES":{"key":"RULES","next":["DO_NOTHING","REVIVE","DIE"],"prev":null,"level":0,"group":1,"pass":false,"type":"root"},"DO_NOTHING":{"key":"DO_NOTHING","next":[],"prev":"RULES","level":1,"group":1,"pass":false,"type":"leaf"},"REVIVE":{"key":"REVIVE","next":[],"prev":"RULES","level":1,"group":1,"pass":false,"type":"leaf"},"DIE":{"key":"DIE","next":[],"prev":"RULES","level":1,"group":1,"pass":false,"type":"leaf"},"SET_IS_ALIVE":{"key":"SET_IS_ALIVE","next":[],"prev":null,"level":0,"group":2,"pass":false,"type":"root"},"CREATE_CELL":{"key":"CREATE_CELL","next":[],"prev":null,"level":0,"group":3,"pass":false,"type":"root"},"ITERATE_GRID":{"key":"ITERATE_GRID","next":[],"prev":null,"level":0,"group":4,"pass":false,"type":"root"},"IS_ALIVE":{"key":"IS_ALIVE","next":[],"prev":null,"level":0,"group":5,"pass":false,"type":"root"}});

quiv.fn["GAME_OF_LIFE"] = (value, key, prev, next) => {
quiv.visit("GAME_OF_LIFE");

return { ...value, canvas: document.getElementById("canvas") }
}
quiv.fn["CONTEXT"] = (value, key, prev, next) => {
quiv.visit("CONTEXT");
const { canvas } = value;

return { ...value, context: canvas.getContext("2d"), cells: [] }
}
quiv.fn["fn[0]"] = (value, key, prev, next) => {
quiv.visit("fn[0]");
const { row, col, cells, context } = value;

return quiv.fn["ITERATE_GRID"]({
row, col, callback:
(x, y) => cells.push(quiv.fn["CREATE_CELL"]({ x, y })) }) ?? value
// Count the nearby population
}
quiv.fn["GAME_LOOP"] = (value, key, prev, next) => {
const { col, row, cells } = value;

return quiv.fn["ITERATE_GRID"]({
row, col, callback:
(x, y) => quiv.sync("RULES")({
cells,
current: x + (y * col),
alive: quiv.fn["IS_ALIVE"]({ x, y, col, row, cells })
})
}) ?? value
}
quiv.fn["fn[1]"] = (value, key, prev, next) => {
const { cells } = value;

return quiv.fn["SET_IS_ALIVE"]({ cells }) ?? value
}
quiv.fn["fn[2]"] = (value, key, prev, next) => {
const { context, width, height, canvas, cells } = value;


// Clear the screen
context.clearRect(0, 0, canvas.width, canvas.height)
cells.forEach(({ x, y, alive }) => {
context.fillStyle = alive ? "#ff8080" : "#303030"
context.fillRect(x * width, y * height, width, height)
})
// Animation loop
setTimeout(() => window.requestAnimationFrame(() => quiv.sync("GAME_LOOP")(value)), 500)

}
quiv.fn["RULES"] = (value, key, prev, next) => {
const { alive, cells, current } = value;

return { rule: [ +(alive === 2), +(alive === 3)], cells, current }

}
quiv.fn["DO_NOTHING"] = (value, key, prev, next) => {
quiv.nodes[key].pass = [{ rule: [1, 0] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }));
if(!quiv.nodes[key].pass) return undefined;
const { cells, current } = value;

return (cells[current].nextAlive = cells[current].alive)
}
quiv.fn["REVIVE"] = (value, key, prev, next) => {
quiv.nodes[key].pass = [{ rule: [0, 1] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }));
if(!quiv.nodes[key].pass) return undefined;
const { cells, current } = value;

return (cells[current].nextAlive = true)
}
quiv.fn["DIE"] = (value, key, prev, next) => {
quiv.nodes[key].pass = [{ rule: [0, 0] }].some((predicate) => quiv.test.isEqual(predicate, value, { partial: true }));
if(!quiv.nodes[key].pass) return undefined;
const { cells, current } = value;

return (cells[current].nextAlive = false)

}
quiv.fn["SET_IS_ALIVE"] = (value, key, prev, next) => {
const { cells } = value;

return cells.forEach((cell) => cell.alive = cell.nextAlive)
}
quiv.fn["CREATE_CELL"] = (value, key, prev, next) => {
const { x, y } = value;

return { x, y, alive: Math.random() > 0.5 } // Store the position of this cell in the grid
}
quiv.fn["ITERATE_GRID"] = (value, key, prev, next) => {
const { row, col, callback } = value;


for (let y = 0; y < row; y++) for (let x = 0; x < col; x++) callback(x, y)
}
quiv.fn["IS_ALIVE"] = (value, key, prev, next) => {
const { x, y, col, row, cells } = value;

return [
{ xd: -1, yd: -1 },
{ xd: 0, yd: -1 },
{ xd: -1, yd: 0 },
{ xd: 1, yd: 0 },
{ xd: -1, yd: 1 },
{ xd: 0, yd: 1 },
{ xd: 1, yd: 1 }
].reduce((result, { xd, yd }) => {
const X = x + xd
const Y = y + yd
return result + ((X < 0 || X >= col || Y < 0 || Y >= row) || !cells[X + (Y * col)].alive ? 0 : 1)
}, 0)
};
export default (value) => {
quiv.setRoot(quiv.nodes["GAME_OF_LIFE"].key);
quiv.visited = {};
quiv.dfsSync(quiv.root, value);
}