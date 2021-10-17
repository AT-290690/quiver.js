start ->
 traces := [quiv.trace("g","e"), quiv.trace("g","l"), quiv.trace("b","asad")]
 paths := traces.map((t) => quiv.path(t))
 quiv.log(await quiv.goTo("g", 5))
 quiv.log(await paths[0].goTo("g", 5))

 quiv.log(await paths[0].goTo("g", 25))
 quiv.log(await paths[1].goTo("g", 15))
 quiv.log(await paths[2].goTo("b", 13))

a -> value
g -> value
	m -> value + 15
	l -> value - 25
	b -> value * 2
		c -> value + 3
			d -> value + 3
				e -> value + 5
				asad -> value * 5