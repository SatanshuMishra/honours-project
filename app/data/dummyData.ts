export const dummyData: {
	difficulty: number;
	question: string;
	code?: string;
	answers: string[];
	correct: number;
	explanations: string[];
	bloomTaxonomy: string;
	timeTakenSeconds: number;
	topic: string;
}[] = [
    {
        "difficulty": 1,
        "question": "What is the primary idea behind recursion in programming?",
        "answers": [
            "Looping a fixed number of times.",
            "Breaking a problem into smaller sub-problems.",
            "Using multiple threads.",
            "Connecting to a database."
        ],
        "correct": 1,
        "explanations": [
            "That's a concept associated with loops.",
            "Recursion involves breaking down a problem into smaller versions of the same problem.",
            "This relates to multi-threading, not recursion.",
            "This relates to databases, not recursion."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 10,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "What is the base case in a recursive function?",
        "answers": [
            "The most complex version of the problem.",
            "The step where the function calls itself.",
            "The condition that stops the recursion.",
            "The initial input to the function."
        ],
        "correct": 2,
        "explanations": [
            "The base case is the simplest version, not the most complex.",
            "This is the recursive case, not the base case.",
            "The base case provides the condition that stops the recursive calls.",
            "Initial input doesn't necessarily mean the base case."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 12,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "In a recursive algorithm for calculating factorials, what would be a suitable base case?",
        "answers": [
            "n = 1 or n = 0.",
            "n = 2.",
            "n is negative.",
            "n = 10."
        ],
        "correct": 0,
        "explanations": [
            "For factorials, the value when n is 0 or 1 is 1, making it a base case.",
            "While factorial of 2 is 2, it's not typically used as a base case.",
            "Factorials for negative numbers are not defined in usual contexts.",
            "There's no special significance for 10 in factorials."
        ],
        "bloomTaxonomy": "Applying",
        "timeTakenSeconds": 15,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "Which of the following is NOT a component of a recursive algorithm?",
        "answers": [
            "A termination condition.",
            "A process to reduce the problem size.",
            "A self-reference or function call.",
            "A global variable."
        ],
        "correct": 3,
        "explanations": [
            "A termination (or base) condition is essential to prevent infinite recursion.",
            "Reducing the problem size is key for recursion to eventually reach the base case.",
            "A recursive algorithm calls itself, making self-reference a vital component.",
            "While global variables can be used in recursion, they aren't a necessary component."
        ],
        "bloomTaxonomy": "Analyzing",
        "timeTakenSeconds": 18,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "When using recursion, the system uses which data structure internally to manage function calls?",
        "answers": [
            "Queue.",
            "Linked List.",
            "Stack.",
            "Heap."
        ],
        "correct": 2,
        "explanations": [
            "Queues are FIFO, which doesn't match the LIFO nature of function calls.",
            "While linked lists can be used to implement stacks, they aren't used directly.",
            "Function calls are managed using a stack, exhibiting LIFO behavior.",
            "Heap is for dynamic memory allocation, not managing function calls."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 15,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "What is a common risk associated with recursion?",
        "answers": [
            "Algorithm becoming too fast.",
            "Memory overflow.",
            "Problems becoming too simple.",
            "Database disconnection."
        ],
        "correct": 1,
        "explanations": [
            "Recursion doesn't inherently make algorithms faster.",
            "Deep or uncontrolled recursion can lead to memory overflows, particularly stack overflow.",
            "Recursion is about breaking down problems, but they don't inherently become too simple.",
            "Recursion doesn't inherently affect database connections."
        ],
        "bloomTaxonomy": "Evaluating",
        "timeTakenSeconds": 12,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "What signifies the end of recursion in a program?",
        "answers": [
            "A loop condition",
            "An if-statement",
            "A base case",
            "A function call"
        ],
        "correct": 2,
        "explanations": [
            "A loop condition signifies repetition, not the end of recursion.",
            "An if-statement is a conditional check, not specific to ending recursion.",
            "A base case is a condition that ends the recursion by not making further calls.",
            "A function call in recursion typically leads to further recursive calls unless it's a base case."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 10,
        "topic": "Recursion"
    },
    {
        "difficulty": 1,
        "question": "What problem can occur if the base case in recursion is not correctly defined?",
        "answers": [
            "Slow execution",
            "Infinite recursion",
            "Syntax error",
            "Compiler warning"
        ],
        "correct": 1,
        "explanations": [
            "Slow execution is a performance issue, not directly related to the absence of a proper base case.",
            "Incorrectly defining or missing a base case can lead to infinite recursion.",
            "Syntax errors are related to code structure, not specifically to the logic of recursion.",
            "Compiler warnings usually indicate potential issues, not logical errors like an incorrect base case."
        ],
        "bloomTaxonomy": "Evaluating",
        "timeTakenSeconds": 15,
        "topic": "Recursion"
    },
    {
        "difficulty": 2,
        "question": "What is the time complexity of the recursive Fibonacci sequence algorithm?",
        "answers": [
            "O(1)",
            "O(n)",
            "O(2^n)",
            "O(log n)"
        ],
        "correct": 2,
        "explanations": [
            "Constant time complexity is not achievable for recursive Fibonacci.",
            "The time complexity of the recursive Fibonacci sequence algorithm is O(2^n).",
            "This is the correct time complexity for the recursive Fibonacci algorithm.",
            "Logarithmic time complexity doesn't apply to the recursive Fibonacci algorithm."
        ],
        "bloomTaxonomy": "Analyzing",
        "timeTakenSeconds": 20,
        "topic": "Recursion"
    },
    {
        "difficulty": 2,
        "question": "What is memoization in the context of recursive algorithms?",
        "answers": [
            "A technique to reduce space complexity.",
            "A process of storing and reusing previously computed results.",
            "A method for breaking down complex problems.",
            "An approach to handling exceptions."
        ],
        "correct": 1,
        "explanations": [
            "Memoization primarily addresses time complexity, not space complexity.",
            "Memoization involves storing and reusing previously computed results to optimize recursive algorithms.",
            "Breaking down complex problems is a general characteristic of recursion, not specific to memoization.",
            "Handling exceptions is a broader concept and not the primary purpose of memoization."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 18,
        "topic": "Recursion"
    },
    {
        "difficulty": 2,
        "question": "What is the purpose of the dynamic programming approach in solving recursive problems?",
        "answers": [
            "To increase the time complexity.",
            "To eliminate the need for base cases.",
            "To reduce time and space complexity.",
            "To make the code longer and more complex."
        ],
        "correct": 2,
        "explanations": [
            "Increasing time complexity is not the goal of dynamic programming.",
            "Base cases are still necessary in dynamic programming; it aims to optimize recursive solutions.",
            "Dynamic programming aims to reduce both time and space complexity through optimal substructure and overlapping subproblems.",
            "The goal is to simplify and optimize code, not make it longer and more complex."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 22,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
        "question": "What is an overlapping subproblem in the context of dynamic programming?",
        "answers": [
            "A subproblem that is too complex to solve.",
            "A subproblem that shares the same substructure with other subproblems.",
            "A subproblem that is redundant and should be skipped.",
            "A subproblem that occurs only once in the entire problem."
        ],
        "correct": 1,
        "explanations": [
            "Complexity alone doesn't define an overlapping subproblem.",
            "Overlapping subproblems share the same substructure with other subproblems, aiding dynamic programming.",
            "Redundancy alone doesn't make a subproblem overlapping; it's about shared substructure.",
            "The occurrence frequency doesn't determine whether a subproblem is overlapping."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 20,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
        "question": "In dynamic programming, what is the purpose of an optimal substructure?",
        "answers": [
            "To make the code more complicated.",
            "To ensure that subproblems are solved in the most efficient way.",
            "To guarantee that the solution to the overall problem can be constructed from optimal solutions to its subproblems.",
            "To eliminate the need for recursion."
        ],
        "correct": 2,
        "explanations": [
            "Complicating code is not the goal of optimal substructure.",
            "Optimal substructure ensures that subproblems are solved optimally, contributing to the overall solution.",
            "The optimal substructure property allows the construction of the overall problem's solution from optimal solutions to its subproblems.",
            "Recursion is a common technique in dynamic programming; optimal substructure doesn't eliminate it."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 18,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
        "question": "What is the primary advantage of using dynamic programming over a naive recursive approach?",
        "answers": [
            "Dynamic programming always has a lower time complexity.",
            "Dynamic programming avoids recursion entirely.",
            "Dynamic programming can solve problems with exponential time complexity more efficiently.",
            "Dynamic programming can avoid using memory."
        ],
        "correct": 2,
        "explanations": [
            "Dynamic programming doesn't always guarantee a lower time complexity but often provides significant improvements.",
            "Recursion is still a common aspect of dynamic programming.",
            "Dynamic programming is effective for optimizing problems with exponential time complexity.",
            "Memory is essential for storing computed results in dynamic programming."
        ],
        "bloomTaxonomy": "Analyzing",
        "timeTakenSeconds": 22,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
        "question": "What is a disadvantage of using recursion in programming?",
        "answers": [
            "Recursion always leads to infinite loops.",
            "Recursion can be less intuitive and harder to debug.",
            "Recursion is always more efficient than iterative solutions.",
            "Recursion doesn't allow for the use of base cases."
        ],
        "correct": 1,
        "explanations": [
            "Recursion doesn't always lead to infinite loops; it depends on the implementation.",
            "Recursion can indeed be less intuitive and harder to debug than iterative solutions.",
            "Recursion's efficiency depends on the specific problem and implementation.",
            "Base cases are essential in recursion to prevent infinite loops."
        ],
        "bloomTaxonomy": "Evaluating",
        "timeTakenSeconds": 20,
        "topic": "Recursion"
    },
    {
        "difficulty": 2,
        "question": "In the context of dynamic programming, what does the term 'bottom-up' refer to?",
        "answers": [
            "Solving the problem from the most complex subproblems to the simplest ones.",
            "Starting with the final solution and working backward to the initial problem.",
            "Avoiding the use of recursion entirely.",
            "Solving the problem without considering its subproblems."
        ],
        "correct": 0,
        "explanations": [
            "Bottom-up dynamic programming involves solving the problem from the simplest subproblems to the most complex ones.",
            "Working backward is a characteristic of 'top-down' dynamic programming with memoization.",
            "Recursion is still involved in bottom-up dynamic programming.",
            "Considering subproblems is fundamental to dynamic programming."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 18,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
        "question": "What is the primary purpose of the 'knapsack problem' in computer science?",
        "answers": [
            "To optimize the packing of items into a fixed-size knapsack.",
            "To unpack items from a knapsack as efficiently as possible.",
            "To solve mathematical equations related to knapsack shapes.",
            "To design a better, more durable knapsack."
        ],
        "correct": 0,
        "explanations": [
            "The 'knapsack problem' involves optimizing the packing of items into a fixed-size knapsack.",
            "Efficient unpacking is not the primary focus of the 'knapsack problem.'",
            "The 'knapsack problem' is more about optimization than solving mathematical equations.",
            "Designing a knapsack is a different problem from the 'knapsack problem' in computer science."
        ],
        "bloomTaxonomy": "Understanding",
        "timeTakenSeconds": 15,
        "topic": "Dynamic Programming"
    },
    {
        "difficulty": 2,
    "question": "What is the purpose of the 'memo' in memoization?",
    "answers": [
        "To write notes about the recursive calls.",
        "To store and reuse previously computed results.",
        "To create a memory leak in the program.",
        "To eliminate the need for base cases."
    ],
    "correct": 1,
    "explanations": [
        "Writing notes is not the primary purpose of the 'memo' in memoization.",
        "The 'memo' in memoization refers to storing and reusing previously computed results to optimize recursive algorithms.",
        "Creating a memory leak is not the goal of memoization.",
        "Base cases are still necessary in memoization; it aims to optimize recursive solutions."
    ],
    "bloomTaxonomy": "Understanding",
    "timeTakenSeconds": 18,
    "topic": "Dynamic Programming"
},
{
	difficulty: 3,
	question:
		'In Java, what is the output of the following recursive method when called with `reversePrint("hello")`?',
	code: "void reversePrint(String s) {\n if (!s.isEmpty()) {\n  reversePrint(s.substring(1));\n  System.out.print(s.charAt(0));\n }\n}",
	answers: ["hello", "olleh", "ehllo", "A Stack Overflow Error"],
	correct: 1,
	explanations: [
		"The method does not print the string in its original order.",
		"The method prints the string in reverse order.",
		"Characters are not rearranged; they're printed in reverse.",
		"There is a base case to prevent a stack overflow.",
	],
	bloomTaxonomy: "Apply", 
	timeTakenSeconds: 45, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question: "In Java, identify the error in this recursive method:",
	code: "int sumArray(int[] arr, int n) {\n return n <= 0 ? 0 : sumArray(arr, n) + arr[n - 1];\n}",
	answers: [
		"Array index out of bounds",
		"Infinite recursion leading to Stack Overflow Error",
		"Incorrect calculation of the sum",
		"Syntax error",
	],
	correct: 1,
	explanations: [
		"The array index is correctly handled, so no out of bounds error.",
		"The method calls itself with the same value of n, leading to infinite recursion.",
		"While the sum calculation logic is correct, the recursive call causes an error.",
		"The syntax is correct, but the logic leads to infinite recursion.",
	],
	bloomTaxonomy: "Analyze", 
	timeTakenSeconds: 50,  
	topic: "Recursion" 
},
{
	difficulty: 1,
	question: "In Java, which statement about recursion is true?",
	answers: [
		"Recursion always leads to better performance than iteration.",
		"Every recursive function must have a return type of void.",
		"Recursion can sometimes be less efficient due to overheads.",
		"Recursive methods cannot be used to solve sorting problems.",
	],
	correct: 2,
	explanations: [
		"Recursion does not always lead to better performance; in some cases, iteration is more efficient.",
		"Recursive functions can have any return type, not just void.",
		"Due to overheads like stack memory usage, recursion can be less efficient than iteration.",
		"Recursive methods can be used in sorting algorithms like merge sort and quicksort.",
	],
	bloomTaxonomy: "Understand", 
	timeTakenSeconds: 30, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"In Java, what error does this recursive function have? `int power(int base, int exp) { return exp < 1 ? 1 : base * power(base, exp); }`",
	code: "int power(int base, int exp) {\n return exp < 1 ? 1 : base * power(base, exp);\n}",
	answers: [
		"Compilation Error",
		"Arithmetic Error",
		"Infinite Recursion",
		"Logic Error",
	],
	correct: 2,
	explanations: [
		"The function compiles without errors.",
		"There is no arithmetic error in the operations performed.",
		"The function causes infinite recursion because the exponent is not decremented in the recursive call.",
		"While the logic is incorrect, the specific error is infinite recursion.",
	],
	bloomTaxonomy: "Analyze",  
	timeTakenSeconds: 60, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"Identify the problem in this method for finding the minimum element in a binary search tree",
	code: "class TreeNode {\n  int value;\n  TreeNode left, right;\n\n  TreeNode(int value) {\n    this.value = value;\n    left = right = null;\n  }\n}\n\npublic static int findMin(TreeNode root) {\n  if (root == null) {\n    return Integer.MAX_VALUE;\n  } else {\n    return Math.min(root.value, findMin(root.left));\n  }\n}",
	answers: [
		"It doesn't check the right subtree",
		"It returns Integer.MAX_VALUE for an empty tree",
		"It causes a NullPointerException",
		"It works correctly",
	],
	correct: 0,
	explanations: [
		"The method fails to check the right subtree, which is necessary for finding the minimum in a binary search tree.",
		"Returning Integer.MAX_VALUE for an empty tree is a valid base case, but the method should also check the right subtree.",
		"There is no risk of NullPointerException as the method correctly checks for null.",
		"The method is incomplete without checking the right subtree.",
	],
	bloomTaxonomy: "Analyze", 
	timeTakenSeconds: 50, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"Complete the code for a recursive method that calculates the sum of all digits in a number",
	code: "public static int sumOfDigits(int n) {\n  if (n == 0) {\n    return 0;\n  } else {\n    return ____ + sumOfDigits(____);\n  }\n}",
	answers: [
		"n % 10, n / 10",
		"n / 10, n % 10",
		"n - 1, n - 1",
		"n, n - 1",
	],
	correct: 0,
	explanations: [
		"'n % 10' gives the last digit, and 'n / 10' reduces the number by one digit. Both are necessary for the sum of digits.",
		"Reversing the order would not correctly calculate the sum of digits.",
		"Subtracting 1 from the number would not help in calculating the sum of digits.",
		"Using 'n' and 'n - 1' would not separate the digits correctly for summation.",
	],
	bloomTaxonomy: "Apply", 
	timeTakenSeconds: 50, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"Review this method for checking if a string is a palindrome. What is the issue?",
	code: "public static boolean isPalindrome(String str, int start, int end) {\n  if (start >= end) {\n    return true;\n  }\n  if (str.charAt(start) != str.charAt(end)) {\n    return false;\n  }\n  return isPalindrome(str, start + 1, end - 1);\n}",
	answers: [
		"It doesn't handle case sensitivity",
		"It has an off-by-one error in the base case",
		"It will throw a StringIndexOutOfBoundsException",
		"It works correctly",
	],
	correct: 2,
	explanations: [
		"Case sensitivity is not addressed, but it's not necessarily an issue depending on the requirements.",
		"The base case is correctly handled to stop the recursion.",
		"The method carefully checks the string boundaries, avoiding StringIndexOutOfBoundsException.",
		"The method correctly checks for a palindrome recursively.",
	],
	bloomTaxonomy: "Analyze", 
	timeTakenSeconds: 50, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"Identify the error in this method for computing the power of a number",
	code: "public static double power(double base, int exponent) {\n  if (exponent == 0) {\n    return 1;\n  } else {\n    return base * power(base, exponent - 1);\n  }\n}",
	answers: [
		"It fails for negative exponents",
		"It returns a floating-point number for integer inputs",
		"It doesn't handle zero as the base",
		"It works correctly",
	],
	correct: 0,
	explanations: [
		"The method does not handle negative exponents, which require a different approach.",
		"Returning a floating-point number is appropriate for power calculations.",
		"Handling zero as the base is not the issue here; the method correctly calculates power for non-negative exponents.",
		"While the method works for non-negative exponents, it fails for negative ones.",
	],
	bloomTaxonomy: "Analyze", 
	timeTakenSeconds: 20, 
	topic: "Recursion" 
},
{
	difficulty: 3,
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
	bloomTaxonomy: "Understand",
	timeTakenSeconds: 40, 
	topic: "Recursion" 
},
{
	difficulty: 3,
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
	bloomTaxonomy: "Analyze", 
	timeTakenSeconds: 40, 
	topic: "Recursion" 
},
{
	difficulty: 3,
	question:
		"What is the result of a recursive function call that does not have a proper termination condition?",
	answers: [
		"A syntax error",
		"An optimized execution",
		"An infinite loop",
		"A faster result",
	],
	correct: 2,
	explanations: [
		"A syntax error would be due to incorrect code structure, not the logic of recursion.",
		"An optimized execution is not the result of missing a termination condition.",
		"Without a proper termination condition, a recursive function can result in an infinite loop.",
		"A faster result is not achieved by lacking a termination condition; it usually leads to problems like infinite loops.",
	],
	bloomTaxonomy: "Understand", 
	timeTakenSeconds: 30,
	topic: "Recursion" 
},
]
 
