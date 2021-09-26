START -> 0
	INC -> ++prev
		LOOP -> prev < 10 ? goTo(parent, prev) : prev
			END -> console.log(prev)