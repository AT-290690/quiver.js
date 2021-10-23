/* 
Example 1
Solving two sum problem
and demonstrating graph testing
*/
>>->
TEST -> 
	{ root, e2e } := ::test
	
	root("TWO_SUM")
	.input({ nums: [2, 7, 11, 15], target: 9 })
	.leaf("OUT")
	.output([0, 1])
	.should("Return correct sum")

	root("TWO_SUM")
	.input({ nums: [3, 2, 4], target: 6 })
	.leaf("OUT")
	.output([1, 2])
	.should("Return correct sum")

	root("TWO_SUM")
	.input({ nums: [3, 3], target: 6 })
	.leaf("OUT")
	.output([0, 1])
	.should("Return correct sum")

	root("TWO_SUM")
	.input({ nums: [-3, 4, 3, 90], target: 0 })
	.leaf("OUT")
	.output([0, 2])
	.should("Return correct sum")

	root("TWO_SUM")
	.input({ nums: [-3, 4, 3, 90], target: 7 })
	.leaf("DESC")
	.output(`Solving two sum problem
	for numbers ${[-3, 4, 3, 90]} 
	with target ${7}
	and demonstrating graph testing`)
	.should("Should print the correct description")

	e2e("TWO_SUM")
	.input({ nums: [-3, 4, 3, 90], target: 0 })
	.output({ OUT: [ 0, 2 ],DESC: `Solving two sum problem
	for numbers ${[-3, 4, 3, 90]}
	with target ${0}
	and demonstrating graph testing`, EXIT: "Program has stopped!" })
	.should("E2E - Return the correct outputs")

	::go("TWO_SUM")({ nums: [-3, 4, 3, 90], target: 0 }).then(res => ::log(res))

TWO_SUM :: { nums, target } ->
	/*
		Iterate the numbers and store diff from
		target as key of the dictionary
	*/
	<- { nums, target, dict: nums.reduce((acc, item, index) => {
		key := target - nums[index]
		acc[key] = index
		<- acc
	}, {}) }

	OUT :: { nums, dict } -> 
	/*
		Access dictionary and push indexes in 
		output array
	*/
	<- nums.reduce((acc, item, index) => {
		key := nums[index]
		if (dict[key] !== undefined && dict[key] !== index) {
			acc.push(index)
			dict[key] = index // in case of a duplicate
		}
		<- acc
	}, [])
	DESC -> `Solving two sum problem
	for numbers ${value.nums} 
	with target ${value.target}
	and demonstrating graph testing`
	EXIT -> "Program has stopped!"
