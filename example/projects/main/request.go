REQUEST ->
		{ method, req, res, init } := args
		{ match, end, imports, routes, toJSON, tryCatch, toString, DB_DIR, DB_FILE } := init;
		{ fs } := imports
		{ body, query, url } := req
		queries := query?.split("&").map(q => {
			[key, value] := q.split("=")
			<- { [key]: value }
		}).reduce((acc,item) => ({...acc,...item}),{}) || {}
		service := { 
			method, body, query: queries, res, url, fs: fs.promises, 
			match, end, toJSON, toString, tryCatch, DB_PATH: DB_DIR + DB_FILE 
		}
		goTo(routes[url.split("?")[0]], service)