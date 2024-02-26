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
}
]
 
