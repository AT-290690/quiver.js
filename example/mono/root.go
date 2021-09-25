root -> []
	a0 -> void(prev.push(1)) || prev 
		b0 -> void(prev.push(2)) || prev
			c0 -> void(prev.push(3)) || prev 
				d0 -> void(prev.push(4)) || prev
					e0 -> void(prev.push(5)) || prev 
						f0 -> prev.length < 20 ? goTo(nodes["a0"], prev) : prev
	
	a1 -> void(prev.push(-1)) || prev 
		b1 -> void(prev.push(-2)) || prev
			c1 -> void(prev.push(-3)) || prev 
				d1 -> void(prev.push(-4)) || prev
					e1 -> void(prev.push(-5)) || prev 
						f1 -> prev.length < 20 ? goTo(nodes["a1"], prev) : prev
							g1 -> goTo(nodes["m0"], prev)