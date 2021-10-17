AGE -> value.match.url(value, "/age") && value || void 0
	AGE[POST] -> value.match.method(value, "POST") && value || void 0
		AGE[POST](validate) -> 
				value.body = value.toJSON(value.body) 
				if (!value.body) <- void (value.end(value.res).status(403).send({ message: "No data provided"}))
				date := new Date(value.body.date) 
				if (!(date.getTime() === date.getTime())) <- void(value.end(value.res).status(403).send({ message: "Invalid date!"}))
				<- { ...value, date }
			AGE[POST](send) -> 
					today := new Date() 
					birthDate := value.date 
					let age = today.getFullYear() - birthDate.getFullYear() 
					month := today.getMonth() - birthDate.getMonth() 
					if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
							age-- 
					}
				<- value.end(value.res).status(200).send(age) 