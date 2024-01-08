export const dummyData: {
	difficulty: number;
	question: string;
	code?: string;
	answers: string[];
	correct: number;
	explanations: string[];
}[] = [
	{
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
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
		difficulty: 1,
		question:
			"In Java, what does the term 'recursive call' refer to in a recursive method?",
		answers: [
			"A call to a different method",
			"A call to the same method within itself",
			"A call to the main method",
			"A call to an external library",
		],
		correct: 1,
		explanations: [
			"A recursive call is not a call to a different method.",
			"In recursion, the method calls itself; this is the recursive call.",
			"Calling the main method is not recursion.",
			"A recursive call does not involve calling external libraries.",
		],
	},
	{
		difficulty: 1,
		question:
			"In Java, what is the result of using recursion to calculate the sum of numbers from 1 to n?",
		answers: ["n(n + 1) / 2", "n!", "2^n", "n^2"],
		correct: 0,
		explanations: [
			"The sum of numbers from 1 to n is given by the formula n(n + 1) / 2.",
			"n! is the factorial of n, not the sum.",
			"2^n represents exponential growth, not the sum of a series.",
			"n^2 is the square of n, not the sum from 1 to n.",
		],
	},
	{
		difficulty: 1,
		question:
			"In Java, how does a recursive method differ from a regular method call?",
		answers: [
			"Recursive methods use more CPU resources.",
			"Recursive methods are only used for mathematical calculations.",
			"Recursive methods call themselves with modified parameters.",
			"Recursive methods cannot return values.",
		],
		correct: 2,
		explanations: [
			"Using more CPU resources is not a defining characteristic of recursive methods.",
			"Recursive methods are not limited to mathematical calculations.",
			"The key aspect of recursion is that the method calls itself with modified parameters.",
			"Recursive methods can return values, just like regular methods.",
		],
	},
	{
		difficulty: 1,
		question:
			"In Java, what will be the output of this recursive method if it's called with `printNumbers(5)`?",
		code: 'void printNumbers(int n) {\n  if (n > 0) {\n    printNumbers(n - 1);\n    System.out.print(n + " ");\n  }\n}',
		answers: [
			"5 4 3 2 1",
			"1 2 3 4 5",
			"Stack Overflow Error",
			"Compilation Error",
		],
		correct: 1,
		explanations: [
			"The numbers are printed in ascending order due to the position of the print statement.",
			"The method prints in ascending order, not descending.",
			"There is no stack overflow since there is a base case.",
			"The code compiles and runs correctly.",
		],
	},
	{
		difficulty: 2,
		question:
			"In Java, what will be the result of calling `factorial(5)` with this recursive method?",
		code: "int factorial(int n) {\n  return n == 0 ? 1 : n * factorial(n - 1);\n}",
		answers: ["120", "24", "5", "None of the above"],
		correct: 0,
		explanations: [
			"5 factorial (5!) is 120, which is correctly calculated by this method.",
			"24 is the factorial of 4, not 5.",
			"The method calculates factorial, not the input number itself.",
			"120 is the correct result, so the correct answer is not 'None of the above'.",
		],
	},
	{
		difficulty: 2,
		question:
			"In Java, what error will occur in this recursive code if the input is a negative number? `int countDown(int n) { return n <= 0 ? n : countDown(n - 1); }`",
		code: "int countDown(int n) {\n  return n <= 0 ? n : countDown(n - 1);\n}",
		answers: [
			"Syntax Error",
			"Arithmetic Error",
			"Stack Overflow Error",
			"No Error",
		],
		correct: 2,
		explanations: [
			"The syntax of the code is correct.",
			"There is no arithmetic error in the code.",
			"For negative numbers, the base case is never reached, leading to a Stack Overflow Error.",
			"There is an error; the method will cause a stack overflow with negative input.",
		],
	},
	{
		difficulty: 2,
		question:
			"What is the issue with this method for reversing a string using recursion?",
		code: "public static String reverseString(String str) {\n    if (str.isEmpty()) {\n        return str;\n    } else {\n        return reverseString(str.substring(1)) + str.charAt(0);\n    }\n}",
		answers: [
			"It doesn't reverse the string correctly",
			"It causes a stack overflow",
			"It will return an empty string",
			"It works correctly",
		],
		correct: 3,
		explanations: [
			"The method correctly reverses the string by recursively processing and concatenating characters.",
			"The method has a base case for empty strings, preventing a stack overflow.",
			"An empty string check ensures that the method handles this case correctly.",
			"The method is a valid implementation of a recursive string reversal.",
		],
	},
	{
		difficulty: 2,
		question:
			"Complete the code for a recursive method that checks if an array is sorted",
		code: "public static boolean isArraySorted(int[] arr, int index) {\n    if (index == arr.length - 1) {\n        return true;\n    }\n    return ____ && isArraySorted(arr, index + 1);\n}",
		answers: [
			"arr[index] < arr[index + 1]",
			"arr[index] <= arr[index + 1]",
			"arr[index] > arr[index + 1]",
			"arr[index] >= arr[index + 1]",
		],
		correct: 1,
		explanations: [
			"For the array to be sorted, each element should be less than or equal to its subsequent element.",
			"The condition 'arr[index] <= arr[index + 1]' checks for non-descending order, suitable for a sorted array check.",
			"Checking if 'arr[index] > arr[index + 1]' would be used to verify if an array is sorted in descending order.",
			"Using 'arr[index] >= arr[index + 1]' would verify descending order, not ascending.",
		],
	},
	{
		difficulty: 2,
		question: "What is the primary disadvantage of using recursion?",
		answers: [
			"Increased memory usage",
			"Slower execution time",
			"Increased code complexity",
			"Incompatibility with certain programming languages",
		],
		correct: 0,
		explanations: [
			"Recursion can lead to increased memory usage due to the stack space required for each function call.",
			"While some recursive algorithms may be slower, this is not the primary disadvantage.",
			"Recursion can actually reduce code complexity for certain problems.",
			"Recursion is compatible with most programming languages, so incompatibility is not a primary concern.",
		],
	},

	{
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 2,
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
		difficulty: 3,
		question:
			'In Java, what is the output of the following recursive method when called with `reversePrint("hello")`?',
		code: "void reversePrint(String s) {\n  if (!s.isEmpty()) {\n    reversePrint(s.substring(1));\n    System.out.print(s.charAt(0));\n  }\n}",
		answers: ["hello", "olleh", "ehllo", "A Stack Overflow Error"],
		correct: 1,
		explanations: [
			"The method does not print the string in its original order.",
			"The method prints the string in reverse order.",
			"Characters are not rearranged; they're printed in reverse.",
			"There is a base case to prevent a stack overflow.",
		],
	},
	{
		difficulty: 3,
		question: "In Java, identify the error in this recursive method:",
		code: "int sumArray(int[] arr, int n) {\n  return n <= 0 ? 0 : sumArray(arr, n) + arr[n - 1];\n}",
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
	},
	{
		difficulty: 3,
		question:
			"In Java, what error does this recursive function have? `int power(int base, int exp) { return exp < 1 ? 1 : base * power(base, exp); }`",
		code: "int power(int base, int exp) {\n  return exp < 1 ? 1 : base * power(base, exp);\n}",
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
	},
	{
		difficulty: 3,
		question:
			"Identify the problem in this method for finding the minimum element in a binary search tree",
		code: "class TreeNode {\n    int value;\n    TreeNode left, right;\n\n    TreeNode(int value) {\n        this.value = value;\n        left = right = null;\n    }\n}\n\npublic static int findMin(TreeNode root) {\n    if (root == null) {\n        return Integer.MAX_VALUE;\n    } else {\n        return Math.min(root.value, findMin(root.left));\n    }\n}",
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
	},
	{
		difficulty: 3,
		question:
			"Complete the code for a recursive method that calculates the sum of all digits in a number",
		code: "public static int sumOfDigits(int n) {\n    if (n == 0) {\n        return 0;\n    } else {\n        return ____ + sumOfDigits(____);\n    }\n}",
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
	},
	{
		difficulty: 3,
		question:
			"Review this method for checking if a string is a palindrome. What is the issue?",
		code: "public static boolean isPalindrome(String str, int start, int end) {\n    if (start >= end) {\n        return true;\n    }\n    if (str.charAt(start) != str.charAt(end)) {\n        return false;\n    }\n    return isPalindrome(str, start + 1, end - 1);\n}",
		answers: [
			"It doesn't handle case sensitivity",
			"It has an off-by-one error in the base case",
			"It will throw a StringIndexOutOfBoundsException",
			"It works correctly",
		],
		correct: 3,
		explanations: [
			"Case sensitivity is not addressed, but it's not necessarily an issue depending on the requirements.",
			"The base case is correctly handled to stop the recursion.",
			"The method carefully checks the string boundaries, avoiding StringIndexOutOfBoundsException.",
			"The method correctly checks for a palindrome recursively.",
		],
	},
	{
		difficulty: 3,
		question:
			"Identify the error in this method for computing the power of a number",
		code: "public static double power(double base, int exponent) {\n    if (exponent == 0) {\n        return 1;\n    } else {\n        return base * power(base, exponent - 1);\n    }\n}",
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
	},
];
