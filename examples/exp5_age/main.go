AGE -> { birthDate: new Date(value), today: new Date() }

	FIND_AGE :: <{ today, birthDate }> ->  
		age := today.getYear() - birthDate.getYear()
		month := today.getMonth() - birthDate.getMonth() 
		<- { age, month }

		GET_ACTUAL_AGE :: <{ age, month }> -> 
		<- month < 0 || 
			(month === 0 
			&& today.getDate() < birthDate.getDate()) ?
				age - 1 : age

			PRINT -> ::log(value)