CAT -> args.match.url(args, "/cat") && args || void 0
	CAT[GET] -> args.match.method(args, "GET") && args || void 0
		CAT[GET][all](validate) -> !("id" in args.query) && args || void 0
			CAT[GET][all](send) -> args.end(args.res).status(200).send(args.toJSON(await args.fs.readFile(args.DB_PATH, "utf8")))
		CAT[GET][id](validate) -> ("id" in args.query) && args || void 0
			CAT[GET][id](send) -> 
				data := await args.fs.readFile(args.DB_PATH, "utf8")
				json := args.toJSON(data)
				args.tryCatch(()=> { 
					if(!json[args.query.id]) {
						throw new Error("Cat not found");
					} else {
						args.end(args.res).status(200).send(json[args.query.id])
					}
				}, (message) => args.end(args.res).status(404).send({message}))	

	CAT[POST] -> args.match.method(args, "POST") && args || void 0
		CAT[POST](validate) -> 
			if (!args.body) <- void (args.end(args.res).status(403).send({ message: "No data provided!"}))
			args.body = args.toJSON(args.body)
			if (!args.body.name || !args.body.age || !args.body.breed) <- void (args.end(args.res).status(403).send({ message: "Missing some or all fields."}))
			<- args
			CAT[POST](send) -> 
				data := await args.fs.readFile(args.DB_PATH, "utf8")
				json := args.toJSON(data)
				id := Object.keys(json).length
				json[id] = { ...args.body, id }
				await args.fs.writeFile(args.DB_PATH, args.toString(json))
				args.end(args.res).status(200).send({ message: "Cat added!" })

	CAT[PUT] -> args.match.method(args, "PUT") && ("id" in args.query) && args || void 0
		CAT[PUT](validate) -> 
			if (!args.body) <- void (args.end(args.res).status(403).send({ message: "No data provided!"}))
			args.body = args.toJSON(args.body)
			if (!args.body.age) <- void (args.end(args.res).status(403).send({ message: "Missing some or all fields."}))
			<- args
			CAT[PUT](send) -> 
				data := await args.fs.readFile(args.DB_PATH, "utf8")
				{ id } := args.query
				json := args.toJSON(data)
				if (!json[id]) <- void(args.end(args.res).status(404).send({ message: "Cat not found!"}))
				json[id] = { ...json[id], age: args.body.age }
				await args.fs.writeFile(args.DB_PATH, args.toString(json))
				args.end(args.res).status(200).send({ message: "Cat updated!" })

	CAT[DELETE] -> args.match.method(args, "DELETE") && args || void 0
		CAT[DELETE](validate) -> ("id" in args.query) && args || void(args.end(args.res).status(403).send({ message: "No id provided!"}))
			CAT[DELETE](send) -> 
				data := await args.fs.readFile(args.DB_PATH, "utf8")
				json := args.toJSON(data)
				{ id } := args.query
				if (!json[id]) <- args.end(args.res).status(403).send({ message: "Cat not found!"})
				delete json[id]
				await args.fs.writeFile(args.DB_PATH, args.toString(json))
				args.end(args.res).status(200).send({ message: "Cat deleted!" })