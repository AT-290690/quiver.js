import FS from "fs"
const { mkdir, writeFile, access, readFile } = FS.promises
import URL from "url"
import http from "http"
>>->
SERVER ! * ->
		init := { 
		match: {
			url: (args, url) => (args.url.split("?")[0] === url) && url || void 0,
			method: (args, method) => ((args.method === method) && method) || void 0
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
		DB_DIR: "./examples/exp2_server/dist/db/",
		DB_FILE: "cats.json",
		}

		PORT := 8075

		start := (req, res) => {
			method := req.method
			urlParsed := URL.parse(req.url)
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
		  ::go(::getRoot())({ method, req, res, init })
		})
	}

		server := http.createServer()
		server.listen(PORT, (err) => err ? setTimeout(()=> {
			::log("Restarting due to error!")
			::leave("SERVER")
			::setRoot("SERVER")
			::go("SERVER")()
		}, 3000) : ::log("http://localhost:" + PORT))
		server.on("request", start)
		
	~ access(init.DB_DIR + init.DB_FILE).catch(async () => {
			await mkdir(init.DB_DIR, { recursive: true } )
			await writeFile(init.DB_DIR + init.DB_FILE,
	`{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`)
	})
	::setRoot("REQUEST")

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
	<- service

	ROUTER :: { match } -> { data: value, "match": match.url(value, "/age") ?? match.url(value, "/cat") }

		AGE <{ "match": "/age" }> :: { data } -> 
			{ match } := data
			<- { 
				data, 
				"match": 
				match.method(data, "POST")
				}
			AGE[POST] <{ "match": "POST" }> :: { data } -> data
				|> -> 
						value.body = value.toJSON(value.body) 
						if (!value.body) <- void (value.end(value.res).status(403).send({ message: "No data provided"}))
						date := new Date(value.body.date) 
						if (!(date.getTime() === date.getTime())) <- void(value.end(value.res).status(403).send({ message: "Invalid date!"}))
						<- { ...value, date }
					|> -> 
							today := new Date() 
							birthDate := value.date 
							let age = today.getFullYear() - birthDate.getFullYear() 
							month := today.getMonth() - birthDate.getMonth() 
							if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
									age-- 
							}
						<- value.end(value.res).status(200).send(age) 

		CAT <{ "match": "/cat" }> :: { data } -> 
					{ match } := data
					<- { 
					data, 
					"match": 
					match.method(data, "GET") ??
					match.method(data, "POST") ??
					match.method(data, "PUT") ??
					match.method(data, "DELETE")
					}

			CAT[GET] <{ "match": "GET" }> :: { data } ->  data
				|> -> { "id": "id" in value.query, data: value }
					|> <{ "id": false }> * :: { data } -> data.end(data.res).status(200).send(data.toJSON(~ readFile(data.DB_PATH, "utf8")))
					|> <{ "id": true }> * :: { data } -> 
						raw := ~ readFile(data.DB_PATH, "utf8")
						json := data.toJSON(raw)
						data.tryCatch(() => { 
							if (!json[data.query.id]) throw new Error("Cat not found") 
							else data.end(data.res).status(200).send(json[data.query.id])
						}, (message) => data.end(data.res).status(404).send({message}))	

			CAT[POST] <{ "match": "POST" }> :: { data } -> data
				|> :: { body, end, res, toJSON } -> 
					if (!body) <- void (end(res).status(403).send({ message: "No data provided!"}))
					json := toJSON(body)
					if (!json.name || !json.age || !json.breed) <- void (end(res).status(403).send({ message: "Missing some or all fields."}))
					<- { ...value, body: json }
					|> * :: { DB_PATH, toJSON, toString,  body, res, end  } -> 
						data := ~ readFile(DB_PATH, "utf8")
						json := toJSON(data)
						id := Object.keys(json).length
						json[id] = { ...body, id }
						~ writeFile(DB_PATH, toString(json))
						end(res).status(200).send({ message: "Cat added!" })

			CAT[PUT] <{ "match": "PUT" }> :: { data } -> data
				|> :: { body, end, res, toJSON } -> 
					if (!body) <- void (end(res).status(403).send({ message: "No data provided!"}))
					json := toJSON(body)
					if (!json.age) <- void (end(res).status(403).send({ message: "Missing some or all fields."}))
					<- { ...value, body: json}
					|> * :: { DB_PATH, toJSON, toString, query, body, res, end } -> 
						data := ~ readFile(DB_PATH, "utf8")
						{ id } := query
						json := toJSON(data)
						if (!json[id]) <- void(end(res).status(404).send({ message: "Cat not found!"}))
						json[id] = { ...json[id], age: body.age }
						~ writeFile(DB_PATH, toString(json))
						end(value.res).status(200).send({ message: "Cat updated!" })

			CAT[DELETE] <{ "match": "DELETE" }> :: { data } -> data
				|> -> ("id" in value.query) && value || void(value.end(value.res).status(403).send({ message: "No id provided!"}))
					|> * :: { DB_PATH, toJSON, toString, query, body, res, end } -> 
						data := ~ readFile(DB_PATH, "utf8")
						json := toJSON(data)
						{ id } := query
						if (!json[id]) <- end(res).status(403).send({ message: "Cat not found!"})
						delete json[id]
						~ writeFile(DB_PATH, toString(json))
						end(res).status(200).send({ message: "Cat deleted!" })