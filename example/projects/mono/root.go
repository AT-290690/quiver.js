root -> []
	a0 -> void(args.push(1)) || args 
		b0 -> void(args.push(2)) || args
			c0 -> void(args.push(3)) || args 
				d0 -> void(args.push(4)) || args
					e0 -> void(args.push(5)) || args 
						f0 -> args.length < 20 ? goTo("a0", args) : args
	
	a1 -> void(args.push(-1)) || args 
		b1 -> void(args.push(-2)) || args
			c1 -> void(args.push(-3)) || args 
				d1 -> void(args.push(-4)) || args
					e1 -> void(args.push(-5)) || args 
						f1 -> args.length < 20 ? goTo("a1", args) : args
							g1 -> goTo("m0", args)