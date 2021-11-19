TEST -> 
	result := ::sync("LAST")([1,2,3])
	::log(result)
LAST -> value
	|> + <[]> :: -> null
	|> + <[first]> :: <[first, ...rest]> -> first
	|> - <[] | [first]> :: <[first, ...rest]> ->
		<- ::fn["LAST"](rest)

			
	START * -> 
	result := ~ ::async("LAST")([1, 2, 3])
	::log(result)

LAST :: <[first, ...rest]> -> 
  if (::test.isEqual(value, [])) <- null
	if (::test.isEqual(rest, [])) <- first
	<- ::fn["LAST"](rest)
	TEST -> 
	result := ::sync("LAST")([1, 2, 3])
	::log(result)
LAST -> { arr: value, is: value }
	|> + <{ is: [] }> :: -> null
	|> + <{ is: [value[0]] }> :: <{ arr: [first] }> -> first
	|> - <{is: [] } | [value[0]]> :: <[first, ...rest]> -> ::fn["LAST"](rest)ß
	TEST -> 
	result := ::sync("LAST")([1, 2, 3])
	::log(result)
LAST -> value
	|> + <[]> :: -> null
	|> + <[value[0]]> :: <[first]> -> first
	|> - <[] | [value[0]]> :: <[first, ...rest]> -> ::fn["LAST"](rest)
