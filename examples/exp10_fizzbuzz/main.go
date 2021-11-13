FIZZ_BUZZ -> 250
	|> -> { 
		"number": value, 
		"when": [
				value % 15 === 0, 
				value % 3 === 0, 
				value % 5 === 0
						].map(Number) 
				} 
		|> <{ "when": [1, 1, 1] }> :: -> ::log("FizzBuzz")
		|> <{ "when": [0, 1, 0] }> :: -> ::log("Fizz")	
		|> <{ "when": [0, 0, 1] }> :: -> ::log("Buzz")	
		|> <{ "when": [0, 0, 0] }> :: { number } -> ::log(number)	