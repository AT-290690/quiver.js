import { Quiver } from '../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"MY_NODE":{"key":"MY_NODE","next":["JOIN","PRINT"],"prev":null,"level":0,"type":"root"},"JOIN":{"key":"JOIN","next":[],"prev":"MY_NODE","level":1,"type":"leaf"},"PRINT":{"key":"PRINT","next":[],"prev":"MY_NODE","level":1,"type":"leaf"}});
/*
Tutorial:

MY_NODE -> value * 10
-----------------compiles to----------------------
{
	MY_NODE: { key: 'MY_NODE', next: [], prev: null, level: 0, type: 'root' }
}
__qvr.arrows['MY_NODE'] = * (value, key, prev, next) => {
	return value * 10;
};
--------------------------------------------------
MY_NODE -> { num : 10, by: 3 }
	ADD -> 
		{ num, by } := value
		<- num + value
	SUB -> 
		{ num, by } := value
		<- num - by
	MULT -> 
		{ num, by } := value
		<- num * by
-----------------compiles to----------------------
{
	MY_NODE: {
		key: 'MY_NODE',
		next: ['ADD', 'SUB', 'MULT'],
		prev: null,
		level: 0,
		type: 'root'
	},
	ADD: { key: 'ADD', next: [], prev: 'MY_NODE', level: 1, type: 'leaf' },
	SUB: { key: 'SUB', next: [], prev: 'MY_NODE', level: 1, type: 'leaf' },
	MULT: { key: 'MULT', next: [], prev: 'MY_NODE', level: 1, type: 'leaf' }
}
__qvr.arrows['MY_NODE'] = * (value, key, prev, next) => {
	return { num: 10, by: 3 };
};
__qvr.arrows['ADD'] = * (value, key, prev, next) => {
	const { num, by } = value;
	return num + value;
};
__qvr.arrows['SUB'] = * (value, key, prev, next) => {
	const { num, by } = value;
	return num - by;
};
__qvr.arrows['MULT'] = * (value, key, prev, next) => {
	const { num, by } = value;
	return num * by;
};
--------------------------------------------------
Nesting is achieved by indentation
Nodes with one indentation below another node
become children (next) of that node 
Default indentations are tabs (size 2)
:: - quiver methods
The code bellow does not work as expected.
It should print Hello World! 
Can you fix it?

run 
npm/yarn qvr to compile
npm/yarn start to run code
*/

// A separator between js and quiver code

quiv.arrows["MY_NODE"] = (value, key, prev, next) => {
return ["Hello"," ", "World", "!"]
}
quiv.arrows["JOIN"] = (value, key, prev, next) => {
const [hello,space,world,mark] = value;
return hello + space + world + mark
}
quiv.arrows["PRINT"] = (value, key, prev, next) => {
return quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["MY_NODE"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}