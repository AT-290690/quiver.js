root -> []
	a0 -> void(prev.push(1)) || prev 
		b0 -> void(prev.push(2)) || prev
			c0 -> void(prev.push(3)) || prev 
				d0 -> void(prev.push(4)) || prev
					e0 -> void(prev.push(5)) || prev 
						f0 -> prev.length < 20 ? goTo("a0", prev) : prev
	
	a1 -> void(prev.push(-1)) || prev 
		b1 -> void(prev.push(-2)) || prev
			c1 -> void(prev.push(-3)) || prev 
				d1 -> void(prev.push(-4)) || prev
					e1 -> void(prev.push(-5)) || prev 
						f1 -> prev.length < 20 ? goTo("a1", prev) : prev
							g1 -> goTo("m0", prev)

m0 -> prev.map(x => x * 2)
	m1 -> prev.map(x => x * 3)
		m2 -> prev.map(x => x * 4)
			m3 -> goTo("logger", prev)
			toAmp -> goTo("amp", prev)

amp -> prev.reduce((acc, x) => acc += Math.abs(x), 0)
	amp1 -> goTo("logger", prev)

logger -> console.log(prev)
