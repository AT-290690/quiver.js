import URL from "url"
import http from "http"
>>->
TEST * ! -> 
	{ e2e, root } := ::test

	SETTINGS := {
		ROUTES: {
			"/age": { node: "AGE", protected: false }
		},
		PORT: 8075,
		match: {
			url: (args, url) => (args.split("?")[0] === url) || void 0,
			method: (args, method) => (args === method) || void 0
		},
		end: (res) => ({
				status: (status) => res.writeHead(status, 
					{ "Content-Type": "application/json" }) && 
					{ send: (data) => void(res.end(JSON.stringify(data))) }
		}),
		toJSON: (json,...args) => JSON.parse(json,...args),
		toString: (json,...args) => JSON.stringify(json,...args),
		tryCatch: (trier, catcher) => {
			let output
			try { output = trier() } catch(err){ 
				output = catcher(err.message) }
			<- output 
		},
		CODES: {
			SUCCESS: 200,
			INVALID: 403,
			NOT_EXIST: 404
		}
	}
	server := ~ ::go("SETUP")(SETTINGS)
	~ root("REQUEST")
	.input({
		method: 'POST',
		init: {... SETTINGS, end: (res) => ({
			status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
			}) 
		},
		res: { writeHead: () => {} },
		req: { 
			body: JSON.stringify({ 
				"date": "06.29.1990" 
				}),
				query: '',
				url: 'http://localhost:8000'
		}
	})
	.leaf("AGE[SEND]")
	.output(31)
	.should("Send correct age")

	~ root("REQUEST")
	.input({
		method: 'POST',
		init: {... SETTINGS, end: (res) => ({
			status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
			}) 
		},
		res: { writeHead: () => {} },
		req: { 
			body: JSON.stringify({ 
				"date": "03.29.1999" 
				}),
				query: '',
				url: 'http://localhost:8000'
		}
	})
	.leaf("AGE[SEND]")
	.output(22)
	.should("Send correct age")

	server["LISTENER"].stop()

	::leave('SETUP')
	

<- SETTINGS
	SETUP ! -> value
		SERVER * ->
			::setRoot("REQUEST")
			<- { init: value } 

			HANDLER :: { init } -> 
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
					::go(::getRoot())({ method, req, res, init })
				})
			}
			<- { PORT: init.PORT, start, init }

				LISTENER :: { PORT, start, init } -> 
					server := http.createServer()
					server.listen(PORT, () => ::log("http://localhost:" + PORT))
					server.on("request", start)
					 port := server.address().port;
					<- { output: "http://localhost:" + PORT, stop: () => server.close() }