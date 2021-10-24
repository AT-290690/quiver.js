SERVER * ! :: { SETTINGS } ->
	::setRoot("REQUEST")
	<- { SETTINGS } 

	HANDLER :: { SETTINGS } -> 
		start := (req, res) => {
			method := req.method
			urlParsed := URL.parse(req.url)
			query := urlParsed.query
		if (req.url === "/favicon.ico") {
			res.writeHead(CODES.SUCCESS, { "Content-Type": "image/x-icon" })
			<- res.end()
		}
	
		let body = ""
		req.on("data", chunk => body += chunk)
		req.on("end", () => {
			if (method !== "GET" && body) {
				req.body = body
			}
			req.query = query
			::go(::getRoot())({ method, req, res, SETTINGS })
		})
	}
	<- { PORT: SETTINGS.PORT, start, SETTINGS }

		LISTENER :: { PORT, start, SETTINGS } -> 
			server := http.createServer()
			server.listen(PORT, () => ::log("Server started!\nListening at http://localhost:" + PORT))
			server.on("request", start)
				port := server.address().port;
			<- { stop: () => server.close() }