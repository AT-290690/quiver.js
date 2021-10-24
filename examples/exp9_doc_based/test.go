
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
	.output({ "INFO": "Lorem ispum dolor bla bla" })
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
	.output({ "AGE": 31 })
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
	.output(31)
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
	.output(22)
	.should("Path - Send correct age")

	server["LISTENER"].stop()

	::leave('SERVER')
	/*
	 after tests passed start the server
	*/
	Object.values(suites).every(test => test) ?
		::go("SERVER")({ SETTINGS }) : console.log('Not all test have passed, server is not started!')
	
