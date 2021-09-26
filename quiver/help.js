console.log(
  `
async (args, key, prev, next, { nodes, memo,
visited, visit, ifNotVisited, leave, goTo, 
setRoot, getRoot, restart, out, shortCircuit }) => ... 
-> declare node
<- return
:= assign (with const)
args - result of prev node
key - current node key 
next - array of children
nodes - adj list
memo - object containing stuff
visited - object containing visited nodes
visit(key) - visit add node to visited - return goTo
ifNotVisited(key, callback) - call a function if node is not visited
shortCircuit(callback) - if a function returns false - stop recursing
leave(key) - remove node from visited
goTo(key, args) - dfs from specific node 
setRoot(key) - sets the root to desired
restart() - resets memo, visited and output
out() - returns output array`
);
