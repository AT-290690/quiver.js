GAME_OF_LIFE ! :: -> { ...value, canvas: document.getElementById("canvas") }
	CONTEXT ! :: <{ canvas }> -> { ...value, context: canvas.getContext("2d"), cells: [] }
		|> ! :: <{ row, col, cells, context }> -> ::fn["ITERATE_GRID"]({ 
			row, col, callback: 
			(x, y) => cells.push(::fn["CREATE_CELL"]({ x, y })) }) ?? value
			// Count the nearby population
			GAME_LOOP :: <{ col, row, cells }> -> ::fn["ITERATE_GRID"]({ 
					row, col, callback: 
					(x, y) => ::sync("RULES")({ 
						cells, 
						current: x + (y * col),
						alive: ::fn["IS_ALIVE"]({ x, y, col, row, cells }) 
						})
					}) ?? value
				|> :: <{ cells }> -> ::fn["SET_IS_ALIVE"]({ cells }) ?? value
					|> :: <{ context, width, height, canvas, cells }> -> 
						// Clear the screen
						context.clearRect(0, 0, canvas.width, canvas.height)
						cells.forEach(({ x, y, alive }) => {
							context.fillStyle = alive ? "#ff8080" : "#303030"
							context.fillRect(x * width, y * height, width, height)
						})
						// Animation loop
						setTimeout(() => window.requestAnimationFrame(() => ::sync("GAME_LOOP")(value)), 500)

RULES :: <{ alive, cells, current }> -> { rule: [ +(alive === 2), +(alive === 3)], cells, current }

	DO_NOTHING <{ rule: [1, 0] }> :: <{ cells, current }> -> (cells[current].nextAlive = cells[current].alive)
	REVIVE <{ rule: [0, 1] }> :: <{ cells, current }> -> (cells[current].nextAlive = true)
	DIE <{ rule: [0, 0] }> :: <{ cells, current }> -> (cells[current].nextAlive = false)

SET_IS_ALIVE :: <{ cells }> -> cells.forEach((cell) => cell.alive = cell.nextAlive) 
CREATE_CELL :: <{ x, y }> -> { x, y, alive: Math.random() > 0.5 } // Store the position of this cell in the grid
ITERATE_GRID :: <{ row, col, callback }> ->
	for (let y = 0; y < row; y++) for (let x = 0; x < col; x++) callback(x, y)
IS_ALIVE :: <{ x, y, col, row, cells }> -> [
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