

GAME_OF_LIFE -> 
   { col, row, width, height } := value
	 
  // The page has loaded, start the game
		canvas := document.getElementById('canvas')
		context := canvas.getContext('2d')
		cells := []
		<- { col, row, width, height, canvas, context, cells }

	CREATE_GRID -> 
			{ row, col, cells, context } := value
				for (let y = 0; y < row; y++) {
						for (let x = 0; x < col; x++) {
								cells.push(::arrows["CREATE_CELL"]({ x, y }))
						}
				}
				<- value
		GAME_LOOP -> value
			CHECK_SURROUNDINGS ->
				{ col, row, cells } := value

				for (let x = 0; x < col; x++) {
					for (let y = 0; y < row; y++) {

							// Count the nearby population
							numAlive := ::arrows["IS_ALIVE"]({ x, y, col, row, cells })
							centerIndex := x + (y * col)

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
				<- value
				DRAW -> 
				{ context, width, height, canvas, cells } := value
				
				// Clear the screen
				context.clearRect(0, 0, canvas.width, canvas.height)
				for (let i = 0; i < cells.length; i++) {
					{ x, y, alive } := 	cells[i]
					context.fillStyle = alive ? '#ff8080' : '#303030'
					context.fillRect(x * width, y * height, width, height)
				}
				// The loop function has reached it's end, keep requesting new frames
				setTimeout(() =>	window.requestAnimationFrame(() => ::go("GAME_LOOP")(value)), 150)

CREATE_CELL ->
{ x, y } := value		
// Store the position of this cell in the grid
// Make random cells alive
<- { x, y, alive: Math.random() > 0.5 }

IS_ALIVE ->
	{ x, y, col, row, cells } := value
	<- [
			{ xd: -1, yd: -1 },
			{ xd: 0, yd: -1 },
			{ xd: -1, yd: 0 },
			{ xd: 1, yd: 0 },
			{ xd: -1, yd: 1 },
			{ xd: 0, yd: 1 },
			{ xd: 1, yd: 1 }
		].reduce((result, { xd, yd }) => {
			X := x + xd
			Y := y + yd 
			<- result + ((X < 0 || X >= col || Y < 0 || Y >= row) || !cells[X + (Y * col)].alive ? 0 : 1)
		}, 0)