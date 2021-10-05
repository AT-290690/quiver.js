hello -> "Hello"
	sp -> value + " "
		world -> value + "World"
			! -> value + "!"
			goTo  -> value + " " + await qvr.goTo("result", 2) && qvr.goTo("log", 3)
result -> value + 1