
TEST -> 
{ tree, root } := ::test

tree("INPUT")
.input(1)
.output(1)
.should("Return number")

tree("INPUT")
.input(3)
.output("Fizz")
.should("Return Fizz")

tree("INPUT")
.input(5)
.output("Buzz")
.should("Return Buzz")

tree("INPUT")
.input(15)
.output("FizzBuzz")
.should("Return FizzBuzz")

root("INPUT")
.input(15)
.leaf("FIZZBUZZ")
.output( "FizzBuzz")
.should("Return FizzBuzz")

root("INPUT")
.input(6)
.leaf("FIZZ")
.output( "Fizz")
.should("Return Fizz")

	INPUT -> value
		|> -> { 
				number: value, 
				predicate: [
				 +(value % 15 === 0),
				 +(value % 3 === 0), 
				 +(value % 5 === 0)
				]
			}
			FIZZBUZZ + ~ <{ predicate: [1, 1, 1] }> :: -> "FizzBuzz"
			FIZZ + ~ <{ predicate: [0, 1, 0] }> :: -> "Fizz"	
			BUZZ + ~ <{ predicate: [0, 0, 1] }> :: -> "Buzz"
			ELSE - ~ <{ predicate: [1, 1, 1] } | { predicate: [0, 1, 0] } | { predicate: [0, 0, 1] }> :: <{ number }> -> number