/*
 yarn quiv - to compile
 node ./blank/dist/main.js - to start
 write code below
*/
/*
Input: s = "babad"
	Output: "bab"
	Note: "aba" is also a valid answer.
*/
>>->
TEST -> 
{ tree } := ::test
tree("LONGEST_PALIDROMIC_SUBSTRING")
.input({ str: "a" })
.output({ "OUTPUT": "a" })
.should("Return longest palidromic substring")

tree("LONGEST_PALIDROMIC_SUBSTRING")
.input({ str: "babad" })
.output({ "OUTPUT": "aba" })
.should("Return longest palidromic substring")

LONGEST_PALIDROMIC_SUBSTRING :: <{ str }> -> { 
	str, 
	len: str.length, 
	allSame: +[...str].every(s => s === str[0]),
	firstAndLastSame: +str[0] === str[str.length - 1]
}
	|> <{ len: 0 } | { len: 1 } | { len: 2, allSame: 1 } | { len: 3, firstAndLastSame: 1 }> :: <{ str }> -> { base: true, str }
		|> :: <{ base, str }> -> base ? str : ::sync("DFS")({ acc: '', str, index: Math.floor(str.length/2) })
			OUTPUT -> ::log(value) ?? value

DFS :: { str, index, acc } -> { 
	str, index, acc,
	palidromic: (str[index - 1] === str[index + 1])
 }
	|> <{ palidromic: true }> :: { str, index } -> { 
		acc: (str[index - 1] ?? '')  + str + (str[index + 1] ?? ''),
		str,
		index: index + 1
	} 
 		|> -> ::sync("DFS")(value)