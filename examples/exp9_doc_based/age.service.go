AGE[PARAMS] :: <{ res, body, end, CODES }> -> 
	data := JSON.parse(body) 
	if (!data) <- void (end(res).status(CODES.INVALID).send({ message: "No data provided"}))
	date := new Date(data.date) 
	if (!(date.getTime() === date.getTime())) <- void(end(res).status(CODES.INVALID).send({ message: "Invalid date!"}))
	<- { date, end, res, CODES }
		
	AGE[WORK] :: <{ date, end, res, CODES }> ->
		today := new Date() 
		birthDate := date 
		let age = today.getFullYear() - birthDate.getFullYear() 
		month := today.getMonth() - birthDate.getMonth() 
		if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
				age-- 
		}			
		<- { end, res, age, CODES }
		
		AGE[SEND] :: <{ end, res, age, CODES }> -> end(res).status(CODES.SUCCESS).send(age)