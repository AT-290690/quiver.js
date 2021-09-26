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