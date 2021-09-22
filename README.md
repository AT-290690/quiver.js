# quiver.js
JavaScript parser for graph based pipe development
```
HELLO -> "Hello"
  SPACE -> prev + " "
    WORLD -> prev + "World"
      PRINT -> console.log(prev)

-> - arrow function
<- return
:= assign with const
indentation is nesting
every node is (prev, current, parent, nodes, memo, dfs) =>
prev = parent output
current = key of current node
parent = parent node key
nodes = object all nodes
memo = object 
dfs = recursive function for traversing the nodes = (node, prev, nodes, memo, parent, memo) => prev

- 0 > HELLO 
- 1 >   SPACE 
- 2 >     WORLD 
- 3 >       PRINT 

nesting with levels
```
adj list:
```json
 {
   "HELLO":{
      "key":"HELLO",
      "next":[
         "SPACE"
      ],
      "level":0,
      "type":"root",
      "prev":null
   },
   "SPACE":{
      "key":"SPACE",
      "next":[
         "WORLD"
      ],
      "level":1,
      "type":"branch",
      "prev":"HELLO"
   },
   "WORLD":{
      "key":"WORLD",
      "next":[
         "PRINT"
      ],
      "level":2,
      "type":"branch",
      "prev":"SPACE"
   },
   "PRINT":{
      "key":"PRINT",
      "next":[
         
      ],
      "level":3,
      "type":"leaf",
      "prev":"WORLD"
   }
}
```
```
- 0 > SERVER 
- 1 >   REQUEST 
- 2 >     HELLO 
- 3 >       HELLO[GET] 
- 2 >     ABOUT 
- 2 >     AGE 
- 3 >       AGE[POST] 
- 4 >         AGE[POST](validate) 
- 5 >           AGE[POST](send) 
- 2 >     CAT 
- 3 >       CAT[GET] 
- 4 >         CAT[GET][all](validate) 
- 5 >           CAT[GET][all](send) 
- 4 >         CAT[GET][id](validate) 
- 5 >           CAT[GET][id](send) 
- 3 >       CAT[POST] 
- 4 >         CAT[POST](validate) 
- 5 >           CAT[POST](send) 
- 3 >       CAT[PUT] 
- 4 >         CAT[PUT](validate) 
- 5 >           CAT[PUT](send) 
- 3 >       CAT[DELETE] 
- 4 >         CAT[DELETE](validate) 
- 5 >           CAT[DELETE](send) 
```
