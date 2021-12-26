|> -> {
	choicesInputRaw: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1`,
	boardInputRaw: `22 13 17 11  0
	8  2 23  4 24
 21  9 14 16  7
	6 10  3 18  5
	1 12 20 15 19
 
	3 15  0  2 22
	9 18 13 17  5
 19  8  7 25 23
 20 11 10 24  4
 14 21 16 12  6
 
 14 21 17 24  4
 10 16 15  9 19
 18  8 23 26 20
 22 11 13  6  5
	2  0 12  3  7`,
	count: { value: -5 },
	inc: { value: -1 },
	W: 5, H: 5 
}
	|> :: <{ choicesInputRaw, boardInputRaw, count, inc, W, H }> -> { 
		W, H, winning: { value: 0 }, winningBoard: { value: [] },
		count, inc,
		globalPicks: choicesInputRaw
		.split(',')
		.map(Number),
		picks: choicesInputRaw
		.split(',')
		.map(Number).slice((count.value+=5) + (++inc.value)),
		matrixes: boardInputRaw
		.split('\n')
		.map(x => x.trim()
							.split(' ')
							.filter(x => x !== ''))
		.reduce((a, item) => {
			if (item.length === 0) return a;
			a.push(item.map(Number));
			return a;
		}, [])
		.reduce((acc, row, i) => {
			if (i % 5 === 0) {
				acc.prevIndex = i;
				acc.matrixes[acc.prevIndex / 5] = [row];
			} else {
				acc.matrixes[acc.prevIndex / 5].push(row); 
			}
			return acc;
		}, { matrixes: [], prevIndex: 0 }).matrixes
	}
		|> :: <{ globalPicks, matrixes, W, H, winning, winningBoard, picks, count, inc }> -> 
			for (let p = 0; p < picks.length; p++) {
				for (let m = 0; m < matrixes.length; m++) {
					const matrix = matrixes[m];
				for (let i = 0; i < W; i++) {
					for (let j = 0; j < H; j++) {
							if (matrix[i][j] === picks[p] && !winning.value) {
								matrix[i][j] = '0';
								if (matrix[i][0] === '0' &&
										matrix[i][1] === '0' &&
										matrix[i][2] === '0' &&
										matrix[i][3] === '0' &&
										matrix[i][4] === '0') {
									winning.value = picks[p];
									winningBoard.value = matrix;
									<- [winningBoard.value, winning.value];
								} else if ( matrix[0][j] === '0' && 
														matrix[1][j] === '0' &&
														matrix[2][j] === '0' &&
														matrix[3][j] === '0' &&
														matrix[4][j] === '0') {
									winning.value = picks[p];
									winningBoard.value = matrix;
									<- [winningBoard.value, winning.value];
								}
							}
						}
					}
				}
			}
			<- ::sync(key)({ W, H, matrixes, winning, winningBoard, globalPicks, count, inc, picks: globalPicks.slice(count.value, (count.value+=5) + (++inc.value)) });	
			|> :: <[board, num]> -> board.reduce((a,x) => a += x.reduce((b,y)=> b += +y, 0),0) * num;
				|> -> ::log(value)
		
