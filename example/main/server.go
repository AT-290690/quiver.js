SERVER ->
		init := { 
		imports: {
			fs: await import("fs"),
			URL: await import("url"),
			http: await import("http")
		},
		routes: {
			"/cat": "CAT",
			"/age": "AGE"
		},
		match: {
			url: (args, url) => (args.url.split("?")[0] === url) || void 0,
			method: (args, method) => (args.method === method) || void 0
		},
		end: (res) => ({
				status: (status) => res.writeHead(status, 
					{ "Content-Type": "application/json" }) && 
					{ send: (data) => res.end(JSON.stringify(data)) }
		}),
		toJSON: (json,...args) => JSON.parse(json,...args),
		toString: (json,...args) => JSON.stringify(json,...args),
		tryCatch: (trier, catcher) => {
			let output
			try { output = trier() } catch(err){ 
				output = catcher(err.message) }
			return output;
 		},
		DB_DIR: "./example/main/dist/db/",
		DB_FILE: "cats.json",
		}

		PORT := 8075
		start := (req, res) => {
			method := req.method
			urlParsed := init.imports.URL.parse(req.url)
			query := urlParsed.query
		if (req.url === "/favicon.ico") {
			res.writeHead(200, { "Content-Type": "image/x-icon" })
			<- res.end()
		}
	
		let body = ""
		req.on("data", chunk => body += chunk)
		req.on("end", () => {
			if (method !== "GET" && body) {
				req.body = body
			}
			req.query = query
			goTo(getRoot(), { method, req, res, init })
		})
	}

		server := init.imports.http.createServer()
		server.listen(PORT, () => console.log("http://localhost:" + PORT))
		server.on("request", start)
		
	{ mkdir, writeFile, access } := init.imports.fs.promises

	await access(init.DB_DIR + init.DB_FILE).catch(async () => {
			await mkdir(init.DB_DIR, { recursive: true } )
			await writeFile(init.DB_DIR + init.DB_FILE,
	`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
	})
	setRoot("REQUEST");
	