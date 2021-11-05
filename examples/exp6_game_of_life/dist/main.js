import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"GAME_OF_LIFE":{"key":"GAME_OF_LIFE","next":["CREATE_GRID"],"prev":null,"level":0,"group":0,"type":"root"},"CREATE_GRID":{"key":"CREATE_GRID","next":["GAME_LOOP"],"prev":"GAME_OF_LIFE","level":1,"group":0,"type":"branch"},"GAME_LOOP":{"key":"GAME_LOOP","next":["CHECK_SURROUNDINGS"],"prev":"CREATE_GRID","level":2,"group":0,"type":"branch"},"CHECK_SURROUNDINGS":{"key":"CHECK_SURROUNDINGS","next":["DRAW"],"prev":"GAME_LOOP","level":3,"group":0,"type":"branch"},"DRAW":{"key":"DRAW","next":[],"prev":"CHECK_SURROUNDINGS","level":4,"group":0,"type":"leaf"},"CREATE_CELL":{"key":"CREATE_CELL","next":[],"prev":null,"level":0,"group":1,"type":"root"},"IS_ALIVE":{"key":"IS_ALIVE","next":[],"prev":null,"level":0,"group":2,"type":"root"}});

quiv.fn["GAME_OF_LIFE"] = (value, key, prev, next) => {
const {col,row,width,height} = value;

// The page has loaded, start the game
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const cells = []
return { col, row, width, height, canvas, context, cells }

}
quiv.fn["CREATE_GRID"] = (value, key, prev, next) => {
const {row,col,cells,context} = value;

for (let y = 0; y < row; y++) {
for (let x = 0; x < col; x++) {
cells.push(quiv.fn["CREATE_CELL"]({ x, y }))
}
}
return value
}
quiv.fn["GAME_LOOP"] = (value, key, prev, next) => {
return value
}
quiv.fn["CHECK_SURROUNDINGS"] = (value, key, prev, next) => {
const {col,row,cells} = value;

for (let x = 0; x < col; x++) {
for (let y = 0; y < row; y++) {

// Count the nearby population
const numAlive = quiv.fn["IS_ALIVE"]({ x, y, col, row, cells })
const centerIndex = x + (y * col)

if (numAlive === 2) {
// Do nothing
cells[centerIndex].nextAlive = cells[centerIndex].alive
} else if (numAlive === 3) {
// Make alive
cells[centerIndex].nextAlive = true
} else {
// Make dead
cells[centerIndex].nextAlive = false
}
}
}

// Apply the new state to the cells
for (let i = 0; i < cells.length; i++) {
cells[i].alive = cells[i].nextAlive
}
return value
}
quiv.fn["DRAW"] = (value, key, prev, next) => {
const {context,width,height,canvas,cells} = value;

// Clear the screen
context.clearRect(0, 0, canvas.width, canvas.height)
for (let i = 0; i < cells.length; i++) {
const { x, y, alive } = 	cells[i]
context.fillStyle = alive ? '#ff8080' : '#303030'
context.fillRect(x * width, y * height, width, height)
}
// The loop function has reached it's end, keep requesting new frames
setTimeout(() =>	window.requestAnimationFrame(() => quiv.go("GAME_LOOP")(value)), 150)


}
quiv.fn["CREATE_CELL"] = (value, key, prev, next) => {
const {x,y} = value;
return { x, y, alive: Math.random() > 0.5 } // Store the position of this cell in the grid

}
quiv.fn["IS_ALIVE"] = (value, key, prev, next) => {
const {x,y,col,row,cells} = value;
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
quiv.goTo(quiv.root, value);
}