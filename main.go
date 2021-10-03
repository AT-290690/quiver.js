hello -> "Hello"
	sp -> value + " "
		world -> value + "World"
			! -> value + "!"
			goTo  -> value + " " + await qvr.goTo("result", 2)
result -> value + 1