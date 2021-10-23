CAT -> value.match.url(value, "/cat") && value || void 0
	CAT[GET] -> value.match.method(value, "GET") && value || void 0
		CAT[GET][all](validate) -> !("id" in value.query) && value || void 0
			CAT[GET][all](send) * -> value.end(value.res).status(200).send(value.toJSON(~ readFile(value.DB_PATH, "utf8")))
		CAT[GET][id](validate) -> ("id" in value.query) && value || void 0
			CAT[GET][id](send) * -> 
				data := ~ readFile(value.DB_PATH, "utf8")
				json := value.toJSON(data)
				value.tryCatch(()=> { 
					if(!json[value.query.id]) {
						throw new Error("Cat not found") 
					} else {
						value.end(value.res).status(200).send(json[value.query.id])
					}
				}, (message) => value.end(value.res).status(404).send({message}))	

	CAT[POST] -> value.match.method(value, "POST") && value || void 0
		CAT[POST](validate) -> 
			if (!value.body) <- void (value.end(value.res).status(403).send({ message: "No data provided!"}))
			value.body = value.toJSON(value.body)
			if (!value.body.name || !value.body.age || !value.body.breed) <- void (value.end(value.res).status(403).send({ message: "Missing some or all fields."}))
			<- value
			CAT[POST](send) * -> 
				data := ~ readFile(value.DB_PATH, "utf8")
				json := value.toJSON(data)
				id := Object.keys(json).length
				json[id] = { ...value.body, id }
				~ writeFile(value.DB_PATH, value.toString(json))
				value.end(value.res).status(200).send({ message: "Cat added!" })

	CAT[PUT] -> value.match.method(value, "PUT") && ("id" in value.query) && value || void 0
		CAT[PUT](validate) -> 
			if (!value.body) <- void (value.end(value.res).status(403).send({ message: "No data provided!"}))
			value.body = value.toJSON(value.body)
			if (!value.body.age) <- void (value.end(value.res).status(403).send({ message: "Missing some or all fields."}))
			<- value
			CAT[PUT](send) * -> 
				data := ~ readFile(value.DB_PATH, "utf8")
				{ id } := value.query
				json := value.toJSON(data)
				if (!json[id]) <- void(value.end(value.res).status(404).send({ message: "Cat not found!"}))
				json[id] = { ...json[id], age: value.body.age }
				~ writeFile(value.DB_PATH, value.toString(json))
				value.end(value.res).status(200).send({ message: "Cat updated!" })

	CAT[DELETE] -> value.match.method(value, "DELETE") && value || void 0
		CAT[DELETE](validate) -> ("id" in value.query) && value || void(value.end(value.res).status(403).send({ message: "No id provided!"}))
			CAT[DELETE](send) * -> 
				data := ~ readFile(value.DB_PATH, "utf8")
				json := value.toJSON(data)
				{ id } := value.query
				if (!json[id]) <- value.end(value.res).status(403).send({ message: "Cat not found!"})
				delete json[id]
				~ writeFile(value.DB_PATH, value.toString(json))
				value.end(value.res).status(200).send({ message: "Cat deleted!" })