hello -> "Hello"
	sp -> :: + " "
		world -> :: + "World"
			! -> :: + "!"
			goTo  -> :: + " " + await #("result", 2) && #("log", 3) && !#("log")
result -> { x: :: + 1, y: 13 }
	out -> 
				{ x, y } := ::
				#("log",6) // blocked!
				<- x * y
log -> console.log(::) || ::