import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"GAME_OF_LIFE":{"key":"GAME_OF_LIFE","next":["CREATE_GRID"],"prev":null,"level":0,"type":"root"},"CREATE_GRID":{"key":"CREATE_GRID","next":["GAME_LOOP"],"prev":"GAME_OF_LIFE","level":1,"type":"branch"},"GAME_LOOP":{"key":"GAME_LOOP","next":["CHECK_SURROUNDINGS"],"prev":"CREATE_GRID","level":2,"type":"branch"},"CHECK_SURROUNDINGS":{"key":"CHECK_SURROUNDINGS","next":["DRAW"],"prev":"GAME_LOOP","level":3,"type":"branch"},"DRAW":{"key":"DRAW","next":[],"prev":"CHECK_SURROUNDINGS","level":4,"type":"leaf"},"CREATE_CELL":{"key":"CREATE_CELL","next":[],"prev":null,"level":0,"type":"root"},"IS_ALIVE":{"key":"IS_ALIVE","next":[],"prev":null,"level":0,"type":"root"}});

quiv.arrows["GAME_OF_LIFE"] = (value, key, prev, next) => {
const { col, row, width, height } = value

// The page has loaded, start the game
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const gameObjects = []
return { col, row, width, height, canvas, context, gameObjects }

}
quiv.arrows["CREATE_GRID"] = (value, key, prev, next) => {
const { row, col, gameObjects, context } = value
for (let y = 0; y < row; y++) {
for (let x = 0; x < col; x++) {
gameObjects.push(quiv.arrows["CREATE_CELL"]({ x, y }))
}
}
return value
}
quiv.arrows["GAME_LOOP"] = (value, key, prev, next) => {
return value
}
quiv.arrows["CHECK_SURROUNDINGS"] = (value, key, prev, next) => {
const { col, row, gameObjects } = value

for (let x = 0; x < col; x++) {
for (let y = 0; y < row; y++) {

// Count the nearby population
const numAlive = quiv.arrows["IS_ALIVE"]({ x, y, col, row, gameObjects })
const centerIndex = x + (y * col)

if (numAlive === 2) {
// Do nothing
gameObjects[centerIndex].nextAlive = gameObjects[centerIndex].alive
} else if (numAlive === 3) {
// Make alive
gameObjects[centerIndex].nextAlive = true
} else {
// Make dead
gameObjects[centerIndex].nextAlive = false
}
}
}

// Apply the new state to the cells
for (let i = 0; i < gameObjects.length; i++) {
gameObjects[i].alive = gameObjects[i].nextAlive
}
return value
}
quiv.arrows["DRAW"] = (value, key, prev, next) => {
const { context, width, height, canvas, gameObjects } = value

// Clear the screen
context.clearRect(0, 0, canvas.width, canvas.height)
for (let i = 0; i < gameObjects.length; i++) {
const { x, y, alive } = 	gameObjects[i]
context.fillStyle = alive ? '#ff8080' : '#303030'
context.fillRect(x * width, y * height, width, height)
}
// The loop function has reached it's end, keep requesting new frames
setTimeout(() =>	window.requestAnimationFrame(() => quiv.go("GAME_LOOP")(value)), 150)

}
quiv.arrows["CREATE_CELL"] = (value, key, prev, next) => {
const { x, y } = value
// Store the position of this cell in the grid
// Make random cells alive
return { x, y, alive: Math.random() > 0.5 }

}
quiv.arrows["IS_ALIVE"] = (value, key, prev, next) => {
const { x, y, col, row, gameObjects } = value
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
return result + ((X < 0 || X >= col || Y < 0 || Y >= row) || !gameObjects[X + (Y * col)].alive ? 0 : 1)
}, 0)
};
export default (value) => {
quiv.setRoot(quiv.nodes["GAME_OF_LIFE"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}