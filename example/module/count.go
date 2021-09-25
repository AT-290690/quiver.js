START -> 0
	INC -> ++prev
		LOOP -> prev < 10 ? goTo(nodes[parent], prev) : prev
			END -> console.log(prev)