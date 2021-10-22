/*
 yarn qvr - to compile
 node ./blank/dist/main.js - to start
 write code below
*/
>>->
TEST -> 
	{ root } := quiv.test()
	
	root('BEFORE_START')
	.input(3)
	.leaf('END')
	.output(10)
	.should('Do math stuff')

BEFORE_START -> 
	<- value === void 0 ? 
		 void 0 : !(typeof value === 'number' && value <= 10 && value >= 3) ?
		 void 0 : value
	START -> value + 1
		MID -> value + 5
			END -> value * 2