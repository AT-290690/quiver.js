/*
 yarn quiv - to compile
 node ./blank/dist/main.js - to start
 write code below
*/
>>->
MAIN -> { name: 'Quiver' }
	HELLO :: { name } -> `Hello world, this program is written in ${name}`
		LOG -> ::log(value)