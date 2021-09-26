begin -> 10
	add -> args + 5
		addRes -> goTo("log", args)
		toMult -> visit(key).goTo("mult", args)
	mult -> args * 22
		multRes -> goTo("log", args)
		toAdd -> visit(key).goTo("add", args)
log -> args