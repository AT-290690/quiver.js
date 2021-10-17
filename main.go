/* 
Solving two sum problem
and demonstrating graph testing
*/
>>>>
TEST -> 

	await >>-> test
	.root("TWO_SUM")
	.input({ nums: [2, 7, 11, 15], target: 9 })
	.leaf("OUT")
	.output([0, 1])
	.should("Return correct sum")

	await >>-> test
	.root("TWO_SUM")
	.input({ nums: [3, 2, 4], target: 6 })
	.leaf("OUT")
	.output([1, 2])
	.should("Return correct sum")

	await >>-> test
	.root("TWO_SUM")
	.input({ nums: [3, 3], target: 6 })
	.leaf("OUT")
	.output([0, 1])
	.should("Return correct sum")

	await >>-> test
	.root("TWO_SUM")
	.input({ nums: [-3, 4, 3, 90], target: 0 })
	.leaf("OUT")
	.output([0, 2])
	.should("Return correct sum")

	console.log(await >>-> go("TWO_SUM")({ nums: [-3, 4, 3, 90], target: 0 }))

TWO_SUM ->
	{ nums, target } := value
	/*
		Iterate the numbers and store diff from
		target as key of the dictionary
	*/
	<- { nums, dict: nums.reduce((acc, item, index) => {
		key := target - nums[index]
		acc[key] = index
		<- acc
	}, {}) }

	OUT -> 
	{ nums, dict } := value
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