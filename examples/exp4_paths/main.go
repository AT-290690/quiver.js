start * ->
 traces := [::trace("g","e"), ::trace("g","l"),::trace("b","asad")]
 paths := traces.map((t) => ::path(t))
 ::log(~ ::go("g")(5))
 ::log(~ paths[0].go("g")(5))

 ::log(~ paths[0].goTo("g", 25))
 ::log(~ paths[1].goTo("g", 15))
 ::log(~ paths[2].goTo("b", 13))

a -> value
g -> value
	m -> value + 15
	l -> value - 25
	b -> value * 2
		c -> value + 3
			d -> value + 3
				e -> value + 5
				asad -> value * 5