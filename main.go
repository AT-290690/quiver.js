MAIN -> __qvr.test.setup("TEST")
TEST -> 
	{ test } := __qvr

	await test.
	root("START").with(5)
	.leaf("TO_NUMBER").with(1000)
	.should("Return correct number")

	await test.
	root("START").with(2)
	.leaf("TO_BOOLEAN").with(false)
	.should("Return correct boolean")

	await test.
	root("START").with(10)
	.leaf("END").with({"b":20,"c":1,"a":10})
	.should("Return correct object")

	await test.
	root("START").with(10)
	.leaf("BB").with({"b":120,"c":20,"a":11,"x":100})
	.should("Return correct object")

	await test.
	root("START").with(10)
	.leaf("ARRAY").with([20, 0, 11])
	.should("Return correct array")

START -> {a: VALUE}
	END -> {b: VALUE.a * 2 , c: VALUE.a - 10, ...VALUE}
	AA1 -> {b: VALUE.a * 12 , c: VALUE.a + 10, ...VALUE}
		BB ->  {...VALUE, x: 100}
	TO_ARRAY -> {b: VALUE.a * 2 , c: VALUE.a - 10, ...VALUE}
		ARRAY -> Object.values(VALUE)
	TO_NUMBER -> VALUE.a * 100
	TO_BOOLEAN -> VALUE.a % 2 === 0
