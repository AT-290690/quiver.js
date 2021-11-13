START * -> 
	result := ~ ::go("LAST")([1, 2, 3])
	::log(result)

LAST :: <[first, ...rest]> -> 
  if (::test.isEqual(value, [])) <- null
	if (::test.isEqual(rest, [])) <- first
	<- ::fn["LAST"](rest)