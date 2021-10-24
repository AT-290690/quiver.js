REQUEST :: { method, req, res, SETTINGS } ->
	{ body, query, url } := req
	{ ROUTES } := SETTINGS
	queries := query?.split("&").map(q => {
		[key, value] := q.split("=")
		<- { [key]: value }
	}).reduce((acc,item) => ({...acc,...item}),{}) || {}
	<- { method, body, query: queries, res, url, ...SETTINGS }

	INFO * :: { match, url, method } -> (
		!match.url(url, "/info") ||
		!match.method(method, "GET")
		) ?
		void 0
		: (~::go("INFO[PARAMS]")(value))["INFO[SEND]"]

	AGE * :: { match, url, method } -> (
		!match.url(url, "/age") ||
		!match.method(method, "POST")
		) ?
		void 0
		: (~::go("AGE[PARAMS]")(value))["AGE[SEND]"]

	