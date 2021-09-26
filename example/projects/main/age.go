AGE -> args.match.url(args, "/age") && args || void 0
	AGE[POST] -> args.match.method(args, "POST") && args || void 0
		AGE[POST](validate) -> 
				args.body = args.toJSON(args.body);
				if (!args.body) <- void (args.end(args.res).status(403).send({ message: "No data provided"}))
				date := new Date(args.body.date);
				if (!(date.getTime() === date.getTime())) <- void(args.end(args.res).status(403).send({ message: "Invalid date!"}))
				<- { ...args, date }
			AGE[POST](send) -> 
					today := new Date();
					birthDate := args.date;
					let age = today.getFullYear() - birthDate.getFullYear();
					month := today.getMonth() - birthDate.getMonth();
					if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
							age--;
					}
				<- args.end(args.res).status(200).send(age);