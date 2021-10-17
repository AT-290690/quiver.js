REQUEST ->
		{ method, req, res, init } := value
		{ match, end, routes, toJSON, tryCatch, toString, DB_DIR, DB_FILE } := init 
		{ body, query, url } := req
		queries := query?.split("&").map(q => {
			[key, value] := q.split("=")
			<- { [key]: value }
		}).reduce((acc,item) => ({...acc,...item}),{}) || {}
		service := { 
			method, body, query: queries, res, url, 
			match, end, toJSON, toString, tryCatch, DB_PATH: DB_DIR + DB_FILE 
		}
		<-<< go(routes[url.split("?")[0]])(service)