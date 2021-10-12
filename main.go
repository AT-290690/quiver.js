hello -> "Hello"
	SPACE -> VALUE + " "
		world -> VALUE + "World"  
			! -> VALUE + "!"
			goTo  -> VALUE + " " + await #("result")(2)
result -> { x: VALUE + 1, y: 13 }
	out -> 
				{ x } := VALUE
				MEMO["date"] = new Date()
				await #("log")(await #('keys')())
				<- x * VALUE.y
	log -> console.log(VALUE)
keys -> Object.keys(NODES)