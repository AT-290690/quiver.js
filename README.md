# quiver.js

JavaScript parser for graph based pipe development

```
HELLO -> "Hello"
  SPACE -> args + " "
    WORLD -> args + "World"
      PRINT -> console.log(args)


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
out() - returns output array


- 0 > HELLO
- 1 >   SPACE
- 2 >     WORLD
- 3 >       PRINT

nesting with levels
```

```json
{
  "HELLO": {
    "key": "HELLO",
    "next": ["SPACE"],
    "level": 0,
    "type": "root",
    "prev": null
  },
  "SPACE": {
    "key": "SPACE",
    "next": ["WORLD"],
    "level": 1,
    "type": "branch",
    "prev": "HELLO"
  },
  "WORLD": {
    "key": "WORLD",
    "next": ["PRINT"],
    "level": 2,
    "type": "branch",
    "prev": "SPACE"
  },
  "PRINT": {
    "key": "PRINT",
    "next": [],
    "level": 3,
    "type": "leaf",
    "prev": "WORLD"
  }
}
```

```
- 0 > SERVER
- 0 > REQUEST
- 1 >  HELLO_CAT
- 2 >   HELLO[GET]
- 1 >  ABOUT
- 1 >  AGE
- 2 >   AGE[POST]
- 3 >    AGE[POST](validate)
- 4 >     AGE[POST](send)
- 1 >  CAT
- 2 >   CAT[GET]
- 3 >    CAT[GET][all](validate)
- 4 >     CAT[GET][all](send)
- 3 >    CAT[GET][id](validate)
- 4 >     CAT[GET][id](send)
- 2 >   CAT[POST]
- 3 >    CAT[POST](validate)
- 4 >     CAT[POST](send)
- 2 >   CAT[PUT]
- 3 >    CAT[PUT](validate)
- 4 >     CAT[PUT](send)
- 2 >   CAT[DELETE]
- 3 >    CAT[DELETE](validate)
- 4 >     CAT[DELETE](send)
```
