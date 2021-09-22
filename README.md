# quiver.js
JavaScript parser for graph based pipe development

 0 > SERVER  
 1 >   REQUEST  
 2 >     HELLO  
 3 >       HELLO[GET]  
 2 >     ABOUT  
 2 >     AGE  
 3 >       AGE[POST]  
 4 >         AGE[POST](validate)  
 5 >           AGE[POST](send)  
 2 >     CAT  
 3 >       CAT[GET]  
 4 >         CAT[GET][all](validate)  
 5 >           CAT[GET][all](send)  
 4 >         CAT[GET][id](validate)  
 5 >           CAT[GET][id](send)  
 3 >       CAT[POST]  
 4 >         CAT[POST](validate)  
 5 >           CAT[POST](send)  
 3 >       CAT[PUT]  
 4 >         CAT[PUT](validate)  
 5 >           CAT[PUT](send)  
 3 >       CAT[DELETE]  
 4 >         CAT[DELETE](validate)  
 5 >           CAT[DELETE](send)  
