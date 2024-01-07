export const dummyData: {
	difficulty: string;
	question: string;
	answers: string[];
	correct: number;
	explanations: string[];
	// lessonID: string;
	// ID: string;
	// type: number;
}[] = [
	{
		difficulty: "easy",
		question: "What is the primary idea behind recursion in programming?",
		answers: [
			"Looping a fixed number of times.",
			"Breaking a problem into smaller sub-problems.",
			"Using multiple threads.",
			"Connecting to a database.",
		],
		correct: 1,
		explanations: [
			"That's a concept associated with loops.",
			"Recursion involves breaking down a problem into smaller versions of the same problem.",
			"This relates to multi-threading, not recursion.",
			"This relates to databases, not recursion.",
		],
	},
	{
		difficulty: "easy",
		question: "What is the base case in a recursive function?",
		answers: [
			"The most complex version of the problem.",
			"The step where the function calls itself.",
			"The condition that stops the recursion.",
			"The initial input to the function.",
		],
		correct: 2,
		explanations: [
			"The base case is the simplest version, not the most complex.",
			"This is the recursive case, not the base case.",
			"The base case provides the condition that stops the recursive calls.",
			"Initial input doesn't necessarily mean the base case.",
		],
	},
	{
		difficulty: "easy",
		question:
			"In a recursive algorithm for calculating factorials, what would be a suitable base case?",
		answers: ["n = 1 or n = 0.", "n = 2.", "n is negative.", "n = 10."],
		correct: 0,
		explanations: [
			"For factorials, the value when n is 0 or 1 is 1, making it a base case.",
			"While factorial of 2 is 2, it's not typically used as a base case.",
			"Factorials for negative numbers are not defined in usual contexts.",
			"There's no special significance for 10 in factorials.",
		],
	},
	{
		difficulty: "easy",
		question:
			"Which of the following is NOT a component of a recursive algorithm?",
		answers: [
			"A termination condition.",
			"A process to reduce the problem size.",
			"A self-reference or function call.",
			"A global variable.",
		],
		correct: 3,
		explanations: [
			"A termination (or base) condition is essential to prevent infinite recursion.",
			"Reducing the problem size is key for recursion to eventually reach the base case.",
			"A recursive algorithm calls itself, making self-reference a vital component.",
			"While global variables can be used in recursion, they aren't a necessary component.",
		],
	},
	{
		difficulty: "easy",
		question:
			"When using recursion, the system uses which data structure internally to manage function calls?",
		answers: ["Queue.", "Linked List.", "Stack.", "Heap."],
		correct: 2,
		explanations: [
			"Queues are FIFO, which doesn't match the LIFO nature of function calls.",
			"While linked lists can be used to implement stacks, they aren't used directly.",
			"Function calls are managed using a stack, exhibiting LIFO behavior.",
			"Heap is for dynamic memory allocation, not managing function calls.",
		],
	},
	{
		difficulty: "easy",
		question: "What is a common risk associated with recursion?",
		answers: [
			"Algorithm becoming too fast.",
			"Memory overflow.",
			"Problems becoming too simple.",
			"Database disconnection.",
		],
		correct: 1,
		explanations: [
			"Recursion doesn't inherently make algorithms faster.",
			"Deep or uncontrolled recursion can lead to memory overflows, particularly stack overflow.",
			"Recursion is about breaking down problems, but they don't inherently become too simple.",
			"Recursion doesn't inherently affect database connections.",
		],
	},
	{
		difficulty: "easy",
		question: "What signifies the end of recursion in a program?",
		answers: [
			"A loop condition",
			"An if-statement",
			"A base case",
			"A function call",
		],
		correct: 2,
		explanations: [
			"A loop condition signifies repetition, not the end of recursion.",
			"An if-statement is a conditional check, not specific to ending recursion.",
			"A base case is a condition that ends the recursion by not making further calls.",
			"A function call in recursion typically leads to further recursive calls unless it's a base case.",
		],
	},
	{
		difficulty: "easy",
		question:
			"What problem can occur if the base case in recursion is not correctly defined?",
		answers: [
			"Slow execution",
			"Infinite recursion",
			"Syntax error",
			"Compiler warning",
		],
		correct: 1,
		explanations: [
			"Slow execution is a performance issue, not directly related to the absence of a proper base case.",
			"Incorrectly defining or missing a base case can lead to infinite recursion.",
			"Syntax errors are related to code structure, not specifically to the logic of recursion.",
			"Compiler warnings usually indicate potential issues, not logical errors like an incorrect base case.",
		],
	},
	{
		difficulty: "easy",
		question:
			"In a recursive function for calculating the sum of numbers, what would be a suitable base case?",
		answers: [
			"Sum equals 10",
			"Sum equals 0",
			"Number of elements equals 0",
			"Number of elements equals 10",
		],
		correct: 2,
		explanations: [
			"Having a sum equal to 10 is not a general base case for sum calculation.",
			"Sum equaling 0 is not a suitable base case for this scenario.",
			"When there are no more elements to add, it's a suitable base case for stopping recursion.",
			"The number of elements being 10 is arbitrary and not a suitable base case.",
		],
	},
	{
		difficulty: "easy",
		question:
			"What does a recursive function typically return in the base case?",
		answers: [
			"A new function call",
			"A specific, predetermined value",
			"The same input argument",
			"Nothing",
		],
		correct: 1,
		explanations: [
			"Returning a new function call would extend, not terminate, the recursion.",
			"In the base case, a recursive function typically returns a specific, known value to terminate the recursion.",
			"Returning the same input argument would likely lead to infinite recursion.",
			"Returning nothing is not typical in recursion, as each call usually contributes to the final result.",
		],
	},
	{
		difficulty: "easy",
		question:
			"How does a recursive function differ from an iterative function?",
		answers: [
			"By using a loop",
			"By calling itself",
			"By executing faster",
			"By using more memory",
		],
		correct: 1,
		explanations: [
			"Using a loop is characteristic of an iterative function, not a recursive one.",
			"The defining feature of a recursive function is that it calls itself.",
			"Recursive functions don't necessarily execute faster than iterative ones.",
			"While recursive functions can use more memory due to the call stack, this is a consequence, not a defining feature.",
		],
	},

	{
		difficulty: "medium",
		question:
			"In a recursive approach to the binary search algorithm, what acts as the 'smaller problem'?",
		answers: [
			"Searching in the first half of the list.",
			"Searching a sub-list or a sub-array.",
			"Searching in a different list.",
			"Using a smaller search key.",
		],
		correct: 1,
		explanations: [
			"It could be the first or second half, depending on the search key.",
			"The algorithm narrows down the search to either the left or right sub-array based on comparison.",
			"The list remains the same; just the portion being searched changes.",
			"The search key remains constant in binary search.",
		],
	},
	{
		difficulty: "medium",
		question:
			"In which scenario might a recursive solution be less efficient than an iterative one?",
		answers: [
			"When the recursive calls are too deep causing a stack overflow.",
			"When there's a base case.",
			"When the problem size is small.",
			"When multi-threading is used.",
		],
		correct: 0,
		explanations: [
			"Deep recursion can lead to stack overflow errors.",
			"A base case is essential for stopping recursion.",
			"For small problem sizes, recursion might be as efficient as iteration.",
			"Multi-threading is orthogonal to the recursion vs iteration decision.",
		],
	},
	{
		difficulty: "medium",
		question: 'What does the term "tail recursion" mean?',
		answers: [
			"It's the first recursive call in a function.",
			"A type of recursion where the recursive call is the last operation in the function.",
			"A recursion that uses two base cases.",
			"A recursion that's optimized for database operations.",
		],
		correct: 1,
		explanations: [
			"Tail recursion refers to the last call, not the first.",
			"In tail recursion, the function returns the result of the recursive call directly.",
			"The number of base cases doesn't define tail recursion.",
			"Tail recursion is a concept about the order of operations, not databases.",
		],
	},
	{
		difficulty: "medium",
		question:
			"Which of these problems is NOT typically solved using recursion?",
		answers: [
			"Tower of Hanoi.",
			"Binary search.",
			"Calculating the sum of an array.",
			"Merging two sorted lists.",
		],
		correct: 2,
		explanations: [
			"Tower of Hanoi is a classic recursion problem.",
			"Binary search can be implemented both iteratively and recursively.",
			"While it can be solved recursively, summing an array is typically done iteratively.",
			"This is a step in merge sort, which can be implemented recursively.",
		],
	},
	{
		difficulty: "medium",
		question:
			"Which of the following might be a side effect of deep recursion without a proper base case?",
		answers: [
			"Infinite loop.",
			"Stack overflow.",
			"Memory leak.",
			"Slow database access.",
		],
		correct: 1,
		explanations: [
			"While similar in effect, infinite loops are not the result of recursion.",
			"Deep recursion without termination can lead to stack overflow errors.",
			"Memory leaks are due to unreleased memory, not recursion per se.",
			"Database access speed is not directly affected by recursion.",
		],
	},
	{
		difficulty: "medium",
		question:
			"Why is tail recursion considered advantageous in some programming languages?",
		answers: [
			"It uses less memory.",
			"It makes code longer.",
			"It eliminates the need for a base case.",
			"It always speeds up the algorithm.",
		],
		correct: 0,
		explanations: [
			"Tail recursion can be optimized by compilers to use constant stack space, making it memory efficient.",
			"The length of code has nothing to do with tail recursion's advantages.",
			"Base cases are still required in tail recursion.",
			"Tail recursion optimizes space, not necessarily speed.",
		],
	},
	{
		difficulty: "medium",
		question:
			"Which of the following data structures fundamentally relies on the principle of recursion?",
		answers: ["Array.", "Stack.", "Queue.", "Tree."],
		correct: 3,
		explanations: [
			"Arrays are linear structures without inherent recursion.",
			"Stacks are LIFO structures without inherent recursion.",
			"Queues are FIFO structures without inherent recursion.",
			"Trees have a recursive nature, with each subtree being a smaller instance of a tree.",
		],
	},
	{
		difficulty: "hard",
		question:
			"A recursive function to compute Fibonacci numbers would have how many recursive calls for an input of n (ignoring the base cases)?",
		answers: ["n", "2", "n-1", "2^n"],
		correct: 3,
		explanations: [
			"Fibonacci numbers require more than one call for many n.",
			"This would only be the case for very small n.",
			"The Fibonacci sequence requires two recursive calls per non-base case.",
			"Without optimizations, a naive Fibonacci recursive algorithm can make up to 2^n calls.",
		],
	},
	{
		difficulty: "hard",
		question:
			"What distinguishes a 'divide and conquer' algorithm from other recursive algorithms?",
		answers: [
			"It involves division of numbers.",
			"It always returns a single answer.",
			"It breaks the problem into smaller, similar sub-problems and combines their solutions.",
			"It requires external libraries.",
		],
		correct: 2,
		explanations: [
			"'Divide and conquer' is about problem decomposition, not numerical division.",
			"Not all 'divide and conquer' algorithms return a single answer.",
			"The hallmark of 'divide and conquer' is decomposing the problem and then combining solutions.",
			"External libraries aren't inherently tied to 'divide and conquer'.",
		],
	},
];
