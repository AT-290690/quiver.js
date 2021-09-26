START -> 0
	INC -> ++args
		LOOP -> args < 10 ? goTo(prev, args) : args
			END -> console.log(args)