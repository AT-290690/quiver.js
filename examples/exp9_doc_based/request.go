REQUEST :: { method, req, res, init } ->
	{ body, query, url } := req
	{ ROUTES } := init
	queries := query?.split("&").map(q => {
		[key, value] := q.split("=")
		<- { [key]: value }
	}).reduce((acc,item) => ({...acc,...item}),{}) || {}
	service := { method, body, query: queries, res, url, ...init }
	<- service

	AGE :: { url, res, body, match, method, end, routes, toJSON, tryCatch, toString, CODES } -> 
		match.url(url, "/age")
		match.method(method, "POST")
		data := toJSON(body) 
		if (!data) <- void (end(res).status(CODES.INVALID).send({ message: "No data provided"}))
		date := new Date(data.date) 
		if (!(date.getTime() === date.getTime())) <- void(end(res).status(CODES.INVALID).send({ message: "Invalid date!"}))
		<- { date, end, res, CODES }
		
		AGE[WORK] :: { date, end, res, CODES } ->
			today := new Date() 
			birthDate := date 
			let age = today.getFullYear() - birthDate.getFullYear() 
			month := today.getMonth() - birthDate.getMonth() 
			if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
					age-- 
			}			
			<- { end, res, age, CODES }
			
			AGE[SEND] :: { end, res, age, CODES } -> end(res).status(CODES.SUCCESS).send(age) ?? age