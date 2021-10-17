start ->
 traces := [<-<< trace("g","e"), <-<< trace("g","l"), <-<< trace("b","asad")]
 paths := traces.map((t) => <-<< path(t))
 <-<< log(await <-<< goTo("g", 5))
 <-<< log(await paths[0].goTo("g", 5))

 <-<< log(await paths[0].goTo("g", 25))
 <-<< log(await paths[1].goTo("g", 15))
 <-<< log(await paths[2].goTo("b", 13))

a -> value
g -> value
	m -> value + 15
	l -> value - 25
	b -> value * 2
		c -> value + 3
			d -> value + 3
				e -> value + 5
				asad -> value * 5