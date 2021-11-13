START * -> 
	result := ~ ::async("LAST")([1, 2, 3])
	::log(result["REC"])

LAST :: <[ first, ...rest ]> -> { first, rest }
	NULL :: <{ first }> -> 
		if (first === undefined) <- null
	ONE :: <{ first, rest }> -> 
		if (::test.isEqual(rest, [])) {
			::visit('REC')
			<- first
		} 
	REC * :: <{ rest }> ->
		out := ~ ::async("LAST")(rest);
		<- out["REC"] ? out["REC"] : out["ONE"]