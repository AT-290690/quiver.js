
TEST * ! :: { SETTINGS } -> 
	{ tree, root } := ::test
	mockRes := {
		SETTINGS: {...SETTINGS, end: (res) => ({
			status: (status) => ({ send: (data) => void(JSON.stringify(data)) })
			}) 
		},
		res: { writeHead: () => {} },
	}
	server := ~ ::go("SERVER")({ SETTINGS })
	URL := 'http://localhost:' + SETTINGS.PORT
	suites := {}

	suites["TREE_INFO_GET_0"] = ~ tree("REQUEST")
	.input({
		...mockRes,
		method: 'GET',
		req: { 
				query: '',
				url: '/info'
		}
	})
	.output({ "INFO": {"INFO[SEND]": "Lorem ispum dolor bla bla" }})
	.should('Tree - Send result from INFO leaf')
	
	suites["TREE_AGE_POST_0"] = ~ tree("REQUEST")
	.input({
		...mockRes,
		method: 'POST',
		req: { 
			body: JSON.stringify({ 
				"date": "06.29.1990" 
				}),
				query: '',
				url: '/age'
		}
	})
	.output({ "AGE": { "AGE[SEND]": 31 }})
	.should('Tree - Send result from AGE leaf')



	suites["R2L_AGE_POST_0"] = ~ root("REQUEST")
	.input({
		...mockRes,
		method: 'POST',
		req: { 
			body: JSON.stringify({ 
				"date": "06.29.1990" 
				}),
				query: '',
				url: '/age'
		}
	})
	.leaf("AGE")
	.output({ "AGE[SEND]": 31 })
	.should("Path - Send correct age")

	suites["R2L_AGE_POST_1"] = ~ root("REQUEST")
	.input({
		...mockRes,
		method: 'POST',
		req: { 
			body: JSON.stringify({ 
				"date": "03.29.1999" 
				}),
				query: '',
				url: '/age'
		}
	})
	.leaf("AGE")
	.output({ "AGE[SEND]": 22 })
	.should("Path - Send correct age")


	suites["R2L_AGE_POST_1"] = ~ root("REQUEST")
	.input({
		...mockRes,
		method: 'POST',
		req: { 
			body: JSON.stringify({ 
				"date": "03.129.1999" 
				}),
				query: '',
				url: '/age'
		}
	})
	.leaf("AGE")
	.fail("Path - Short circuit if invalid date")

	suites["R2L_AGE_SERVICE_0"] = ~ root("AGE[PARAMS]")
	.input({
		...mockRes.SETTINGS,
		body: JSON.stringify({ 
				"date": "03.29.1999" 
		}),
	})
	.leaf("AGE[SEND]")
	.output(22)
	.should("Path - Age Service")


	server["LISTENER"].stop()

	::leave('SERVER')
	/*
	 after tests passed start the server
	*/
	Object.values(suites).every(test => test) ?
		::go("SERVER")({ SETTINGS }) : console.log('Not all test have passed, server is not started!')
	
