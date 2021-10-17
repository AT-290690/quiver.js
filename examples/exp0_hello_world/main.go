/* 
Example 0
Demonstrating simple hello world program
*/
>>->
HELLO -> 
	<- "Hello"
	SPACE -> value + " "
		WORLD -> value + "World"
			! -> value + "!"
				PRINT -> <-<< log(value)