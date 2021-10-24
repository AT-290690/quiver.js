import URL from "url"
import http from "http"
>>->
SETUP -> 
SETTINGS := {
	ROUTES: {
		"/age": { node: "AGE", protected: false }
	},
	PORT: 8075,
	match: {
		url: (args, url) => args.split("?")[0] === url,
		method: (args, method) => args === method
	},
	end: (res) => ({
			status: (status) => res.writeHead(status, 
				{ "Content-Type": "application/json" }) && 
				{ send: (data) => void(res.end(JSON.stringify(data))) }
	}),
	toJSON: (json,...args) => JSON.parse(json,...args),
	toString: (json,...args) => JSON.stringify(json,...args),
	tryCatch: (trier, catcher) => {
		let output
		try { output = trier() } catch(err){ 
			output = catcher(err.message) }
		<- output 
	},
	CODES: {
		SUCCESS: 200,
		INVALID: 403,
		NOT_EXIST: 404
	}
}
<- ::go("TEST")({ SETTINGS })
	