REQUEST :: <{ method, req, res, SETTINGS }> ->
	{ body, query, url } := req
	queries := query?.split("&").map(q => {
		[key, value] := q.split("=")
		<- { [key]: value }
	}).reduce((acc,item) => ({...acc,...item}),{}) || {}
	<- { method, body, query: queries, res, url, ...SETTINGS }

	INFO * :: <{ match, url, method }> -> (
		!match.url(url, "/info") ||
		!match.method(method, "GET")
		) ?
		void 0
		: (~::async("INFO[PARAMS]")(value))

	AGE * :: <{ match, url, method }> -> (
		!match.url(url, "/age") ||
		!match.method(method, "POST")
		) ?
		void 0
		: (~::async("AGE[PARAMS]")(value))

	