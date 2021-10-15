TEST -> 
		fail := (desc, a, b) => console.log('\x1b[31m',  `FAIL: ${desc}`, '\x1b[32m',`\n\tExpected: ${a}`, '\x1b[31m', `\n\tRecieved: ${b}`, '\x1b[0m')
		success := (desc) => console.log('\x1b[32m', `SUCCESS: ${desc}`, '\x1b[0m')
		{ output } := __qvr;
		from := (root) => ({ with: (inp) => ({ should: (desc) => ({ at: (a) => ({ toBe: (b) => #(root)(inp).then(()=> output[a].result === b ? success(desc) : fail(desc, output[a].result, b))})})})})
		<- { from, output }
	ACTION -> 		
		{ from } := VALUE
		from("START").with(10)
		.should("Return 22 value")
		.at("END")
		.toBe(23)

START -> VALUE
	END -> VALUE + 12
	AA1 -> VALUE * 2
		BB -> VALUE + 42