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