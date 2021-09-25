SERVER ->
		if (memo.init) <- prev
			 memo.init = Object.freeze({ 
			imports: {
				fs: await import("fs"),
				URL: await import("url"),
				http: await import("http")
			},
			match: {
				url: (prev, url) => (prev.url.split("?")[0] === url) || void 0,
				method: (prev, method) => (prev.method === method) || void 0
			},
			end: (res) => ({
					status: (status) => res.writeHead(status, 
					 { "Content-Type": "application/json" }) && 
					 { send: (data) => res.end(JSON.stringify(data)) }
			}),
			toJSON: (json,...args) => JSON.parse(json,...args),
			toString: (json,...args) => JSON.stringify(json,...args),
			DB_DIR: "./example/main/dist/db/",
			DB_FILE: "cats.json",
		 })
		 PORT := 8075
		 start := (req, res) => {
			 method := req.method
			 urlParsed := memo.init.imports.URL.parse(req.url)
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
				run({ method, req, res })
			})
		}
	
			server := memo.init.imports.http.createServer()
			server.listen(PORT, () => console.log("http://localhost:" + PORT))
			server.on("request", start)
			
		{ mkdir, writeFile, access } := memo.init.imports.fs.promises

		await access(memo.init.DB_DIR + memo.init.DB_FILE).catch(async () => {
			 await mkdir(memo.init.DB_DIR, { recursive: true } )
			 await writeFile(memo.init.DB_DIR + memo.init.DB_FILE,
		`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
		})
		<- void 0 // short circuit server init

	REQUEST -> 
			{ method, req, res, quiver } := prev
			{ match, end, imports, toJSON, toString, DB_DIR, DB_FILE } := memo.init
			{ fs } := imports
			{ body, query, url } := req
			queries := query?.split("&").map(q => {
				[key, value] := q.split("=")
				<- { [key]: value }
			}).reduce((acc,item) => ({...acc,...item}),{}) || {}

			<- { method, body, query: queries, res, url, fs: fs.promises, match, end, toJSON, toString, DB_PATH: DB_DIR + DB_FILE }

		HELLO_CAT -> prev.match.url(prev, "/hello") && prev || void 0
			HELLO[GET] -> prev.match.method(prev, "GET") && prev.end(prev.res).status(200).send({ message: "Hello, do you like cats?"})

		ABOUT -> prev.match.url(prev, "/about") &&
			prev.match.method(prev, "GET") && 
			prev.end(prev.res).status(200).send({ message: "This is a demo for service code generation using a graph" })

		AGE -> prev.match.url(prev, "/age") && prev || void 0
			AGE[POST] -> prev.match.method(prev, "POST") && prev || void 0
				AGE[POST](validate) -> 
						prev.body = prev.toJSON(prev.body);
						if (!prev.body) <- void (prev.end(prev.res).status(403).send({ message: "No data provided"}))
						date := new Date(prev.body.date);
						if (!(date.getTime() === date.getTime())) <- void(prev.end(prev.res).status(403).send({ message: "Invalid date!"}))
						<- { ...prev, date }
					AGE[POST](send) -> 
							today := new Date();
							birthDate := prev.date;
							let age = today.getFullYear() - birthDate.getFullYear();
							month := today.getMonth() - birthDate.getMonth();
							if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
									age--;
							}
						<- prev.end(prev.res).status(200).send(age);

		CAT -> prev.match.url(prev, "/cat") && prev || void 0
			CAT[GET] -> prev.match.method(prev, "GET") && prev || void 0
				CAT[GET][all](validate) -> !("id" in prev.query) && prev || void 0
					CAT[GET][all](send) -> prev.end(prev.res).status(200).send(prev.toJSON(await prev.fs.readFile(prev.DB_PATH, "utf8")))
				CAT[GET][id](validate) -> ("id" in prev.query) && prev || void 0
					CAT[GET][id](send) -> 
						data := await prev.fs.readFile(prev.DB_PATH, "utf8")
						json := prev.toJSON(data)
						if (json[prev.query.id]) {
							prev.end(prev.res).status(200).send(json[prev.query.id])
						} else {
							prev.end(prev.res).status(404).send({ message: "Cat not found!"})
						}

			CAT[POST] -> prev.match.method(prev, "POST") && prev || void 0
				CAT[POST](validate) -> 
					if (!prev.body) <- void (prev.end(prev.res).status(403).send({ message: "No data provided!"}))
					prev.body = prev.toJSON(prev.body)
					if (!prev.body.name || !prev.body.age || !prev.body.breed) <- void (prev.end(prev.res).status(403).send({ message: "Missing some or all fields."}))
					<- prev
					CAT[POST](send) -> 
						data := await prev.fs.readFile(prev.DB_PATH, "utf8")
						json := prev.toJSON(data)
						id := Object.keys(json).length
						json[id] = { ...prev.body, id }
						await prev.fs.writeFile(prev.DB_PATH, prev.toString(json))
						prev.end(prev.res).status(200).send({ message: "Cat added!" })

			CAT[PUT] -> prev.match.method(prev, "PUT") && ("id" in prev.query) && prev || void 0
				CAT[PUT](validate) -> 
					if (!prev.body) <- void (prev.end(prev.res).status(403).send({ message: "No data provided!"}))
					prev.body = prev.toJSON(prev.body)
					if (!prev.body.age) <- void (prev.end(prev.res).status(403).send({ message: "Missing some or all fields."}))
					<- prev
					CAT[PUT](send) -> 
						data := await prev.fs.readFile(prev.DB_PATH, "utf8")
						{ id } := prev.query
						json := prev.toJSON(data)
						if (!json[id]) <- void(prev.end(prev.res).status(404).send({ message: "Cat not found!"}))
						json[id] = { ...json[id], age: prev.body.age }
						await prev.fs.writeFile(prev.DB_PATH, prev.toString(json))
						prev.end(prev.res).status(200).send({ message: "Cat updated!" })

			CAT[DELETE] -> prev.match.method(prev, "DELETE") && prev || void 0
				CAT[DELETE](validate) -> ("id" in prev.query) && prev || void(prev.end(prev.res).status(403).send({ message: "No id provided!"}))
					CAT[DELETE](send) -> 
						data := await prev.fs.readFile(prev.DB_PATH, "utf8")
						json := prev.toJSON(data)
						{ id } := prev.query
						if (!json[id]) <- prev.end(prev.res).status(403).send({ message: "Cat not found!"})
						delete json[id]
						await prev.fs.writeFile(prev.DB_PATH, prev.toString(json))
						prev.end(prev.res).status(200).send({ message: "Cat deleted!" })