TEST -> 
	result := ::sync("LAST")([1, 2, 3, 4, 5, 6])
	::log(result)
LAST -> value
	|> + <[]> :: -> null
	|> + <[first]> :: <[first]> -> first
	|> - <[first]> :: <[first, ...rest]> -> ::sync("LAST")(rest)