OUT * -> ::log( 
( ~ ::go("RECURSION")
({number: 5, val: 10, n: 5 }))
["ADD_TIMES"] 
)	
RECURSION -> { ...value, count: !value.count ? 0 : value.count }
	ADD_TIMES * -> 
		{ number, n, val, count } := value
		<- n > value.count ? 
		( ~ ::go("RECURSION")
		({ number: number * val, count: ++value.count, val, n }))
		["ADD_TIMES"] :
		number