begin -> 10
	add -> prev + 5
		addRes -> goTo("log", prev)
		toMult -> visit(current).goTo("mult", prev)
	mult -> prev * 22
		multRes -> goTo("log", prev)
		toAdd -> visit(current).goTo("add", prev)
log -> console.log(prev)