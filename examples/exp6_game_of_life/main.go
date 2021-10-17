

GAME_OF_LIFE -> 
   { col, row, width, height } := value
  // The page has loaded, start the game
		canvas := document.getElementById('canvas')
		context := canvas.getContext('2d')
		gameObjects := []
		<- { col, row, width, height, canvas, context, gameObjects }

	CREATE_GRID -> 
			{ row, col, gameObjects, context } := value
				for (let y = 0; y < row; y++) {
						for (let x = 0; x < col; x++) {
								gameObjects.push(await quiv.func["CREATE_CELL"]({ x, y }))
						}
				}
				<- value
		GAME_LOOP -> value
			CHECK_SURROUNDINGS ->
				{ col, row, gameObjects } := value

				for (let x = 0; x < col; x++) {
					for (let y = 0; y < row; y++) {

							// Count the nearby population
							numAlive := await quiv.func["IS_ALIVE"]({ x: x - 1, y: y - 1, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x, y: y - 1, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x: x - 1, y, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x: x + 1, y, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x: x - 1, y: y + 1, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x, y: y + 1, col, row, gameObjects }) 
							+ await quiv.func["IS_ALIVE"]({ x: x + 1, y: y + 1, col, row, gameObjects })
							
							centerIndex := await quiv.func["GRID_TO_INDEX"]({ x, y, col })

							if (numAlive === 2){
									// Do nothing
									gameObjects[centerIndex].nextAlive = gameObjects[centerIndex].alive
							}else if (numAlive === 3){
									// Make alive
									gameObjects[centerIndex].nextAlive = true
							}else{
									// Make dead
									gameObjects[centerIndex].nextAlive = false
							}
					}
				}

				// Apply the new state to the cells
				for (let i = 0; i < gameObjects.length; i++) {
					gameObjects[i].alive = gameObjects[i].nextAlive
				}
				<- value
				DRAW -> 
				{ context, width, height, canvas, gameObjects } := value
				// Clear the screen
				context.clearRect(0, 0, canvas.width, canvas.height)
				for (let i = 0; i < gameObjects.length; i++) {
					{ x, y, alive } := 	gameObjects[i]
					context.fillStyle = alive ? '#ff8080' : '#303030'
					context.fillRect(x * width, y * height, width, height)
				}
				// The loop function has reached it's end, keep requesting new frames
				setTimeout(() =>	window.requestAnimationFrame(() => quiv.go("GAME_LOOP")(value)), 150)

CREATE_CELL ->
{ x, y } := value		
// Store the position of this cell in the grid
// Make random cells alive
<- { x, y, alive: Math.random() > 0.5 }

GRID_TO_INDEX ->
	{ x, y, col } := value
<- x + (y * col)

IS_ALIVE ->
	{ x, y, col, row, gameObjects } := value
	
		if (x < 0 || x >= col || y < 0 || y >= row) {
			<- false
		} 
	<- gameObjects[await quiv.func["GRID_TO_INDEX"]({ x, y, col })].alive ? 1 : 0

