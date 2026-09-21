"""
20 Beginner-Friendly Coding Problems for CodePractice
"""

SEED_PROBLEMS = [
    {
        "problem_number": 1,
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "examples": [
            {"input": "[2, 7, 11, 15], 9", "output": "[0, 1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
            {"input": "[3, 2, 4], 6", "output": "[1, 2]", "explanation": "nums[1] + nums[2] == 6."}
        ],
        "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
        "starter_code": {
            "python": "def two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []",
            "javascript": "function twoSum(nums, target) {\n    // Write your solution here\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (seen.has(diff)) return [seen.get(diff), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution\n        return new int[]{0, 1};\n    }\n}",
            "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write solution\n        return {0, 1};\n    }\n};"
        },
        "test_cases": [
            {"input": [[2, 7, 11, 15], 9], "expected_output": "[0, 1]"},
            {"input": [[3, 2, 4], 6], "expected_output": "[1, 2]"}
        ],
        "hidden_test_cases": [
            {"input": [[3, 3], 6], "expected_output": "[0, 1]"},
            {"input": [[1, 5, 8, 3], 11], "expected_output": "[2, 3]"}
        ]
    },
    {
        "problem_number": 2,
        "title": "Reverse String",
        "slug": "reverse-string",
        "difficulty": "Easy",
        "category": "String",
        "description": "Write a function that reverses a string. The input string is given as a string `s`.\n\nReturn the reversed string.",
        "examples": [
            {"input": "\"hello\"", "output": "\"olleh\"", "explanation": "Reversing 'hello' gives 'olleh'."},
            {"input": "\"CodePractice\"", "output": "\"ecitcarPedoC\"", "explanation": "Reversing 'CodePractice' gives 'ecitcarPedoC'."}
        ],
        "constraints": ["1 <= s.length <= 10^5", "s consists of printable ASCII characters."],
        "starter_code": {
            "python": "def reverse_string(s):\n    # Write your solution here\n    return s[::-1]",
            "javascript": "function reverseString(s) {\n    // Write your solution here\n    return s.split('').reverse().join('');\n}",
            "java": "class Solution {\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}",
            "cpp": "string reverseString(string s) {\n    reverse(s.begin(), s.end());\n    return s;\n}"
        },
        "test_cases": [
            {"input": "hello", "expected_output": "\"olleh\""},
            {"input": "CodePractice", "expected_output": "\"ecitcarPedoC\""}
        ],
        "hidden_test_cases": [
            {"input": "a", "expected_output": "\"a\""},
            {"input": "algorithm", "expected_output": "\"mhtirogla\""}
        ]
    },
    {
        "problem_number": 3,
        "title": "Palindrome Number",
        "slug": "palindrome-number",
        "difficulty": "Easy",
        "category": "String",
        "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.",
        "examples": [
            {"input": "121", "output": "true", "explanation": "121 reads as 121 from left to right and from right to left."},
            {"input": "-121", "output": "false", "explanation": "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."}
        ],
        "constraints": ["-2^31 <= x <= 2^31 - 1"],
        "starter_code": {
            "python": "def is_palindrome(x):\n    # Write your solution here\n    s = str(x)\n    return s == s[::-1]",
            "javascript": "function isPalindrome(x) {\n    const s = String(x);\n    return s === s.split('').reverse().join('');\n}",
            "java": "class Solution {\n    public boolean isPalindrome(int x) {\n        String s = String.valueOf(x);\n        return s.equals(new StringBuilder(s).reverse().toString());\n    }\n}",
            "cpp": "bool isPalindrome(int x) {\n    string s = to_string(x);\n    string r = s;\n    reverse(r.begin(), r.end());\n    return s == r;\n}"
        },
        "test_cases": [
            {"input": 121, "expected_output": "true"},
            {"input": -121, "expected_output": "false"}
        ],
        "hidden_test_cases": [
            {"input": 10, "expected_output": "false"},
            {"input": 12321, "expected_output": "true"}
        ]
    },
    {
        "problem_number": 4,
        "title": "Valid Parentheses",
        "slug": "valid-parentheses",
        "difficulty": "Easy",
        "category": "Stack",
        "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        "examples": [
            {"input": "\"()\"", "output": "true", "explanation": "Parentheses match correctly."},
            {"input": "\"()[]{}\"", "output": "true", "explanation": "All pairs match correctly."},
            {"input": "\"(]\"", "output": "false", "explanation": "Bracket types mismatch."}
        ],
        "constraints": ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        "starter_code": {
            "python": "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            "javascript": "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}",
            "java": "class Solution {\n    public boolean isValid(String s) {\n        return true;\n    }\n}",
            "cpp": "bool isValid(string s) {\n    return true;\n}"
        },
        "test_cases": [
            {"input": "()", "expected_output": "true"},
            {"input": "()[]{}", "expected_output": "true"}
        ],
        "hidden_test_cases": [
            {"input": "(]", "expected_output": "false"},
            {"input": "([)]", "expected_output": "false"},
            {"input": "{[]}", "expected_output": "true"}
        ]
    },
    {
        "problem_number": 5,
        "title": "Find Maximum Number",
        "slug": "find-maximum-number",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an array of numbers `nums`, write a function to find and return the maximum number in the array.",
        "examples": [
            {"input": "[1, 5, 3, 9, 2]", "output": "9", "explanation": "9 is the maximum value in the array."},
            {"input": "[-10, -5, -20]", "output": "-5", "explanation": "-5 is the highest number."}
        ],
        "constraints": ["1 <= nums.length <= 10^5"],
        "starter_code": {
            "python": "def find_max(nums):\n    return max(nums)",
            "javascript": "function findMax(nums) {\n    return Math.max(...nums);\n}",
            "java": "class Solution {\n    public int findMax(int[] nums) {\n        int max = nums[0];\n        for(int n : nums) if(n > max) max = n;\n        return max;\n    }\n}",
            "cpp": "int findMax(vector<int>& nums) {\n    return *max_element(nums.begin(), nums.end());\n}"
        },
        "test_cases": [
            {"input": [1, 5, 3, 9, 2], "expected_output": "9"},
            {"input": [-10, -5, -20], "expected_output": "-5"}
        ],
        "hidden_test_cases": [
            {"input": [42], "expected_output": "42"},
            {"input": [100, 0, 50, 999], "expected_output": "999"}
        ]
    },
    {
        "problem_number": 6,
        "title": "Find Minimum Number",
        "slug": "find-minimum-number",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an array of numbers `nums`, write a function to find and return the minimum number in the array.",
        "examples": [
            {"input": "[4, 2, 8, 1, 9]", "output": "1", "explanation": "1 is the minimum value in the array."}
        ],
        "constraints": ["1 <= nums.length <= 10^5"],
        "starter_code": {
            "python": "def find_min(nums):\n    return min(nums)",
            "javascript": "function findMin(nums) {\n    return Math.min(...nums);\n}",
            "java": "class Solution {\n    public int findMin(int[] nums) {\n        int min = nums[0];\n        for(int n : nums) if(n < min) min = n;\n        return min;\n    }\n}",
            "cpp": "int findMin(vector<int>& nums) {\n    return *min_element(nums.begin(), nums.end());\n}"
        },
        "test_cases": [
            {"input": [4, 2, 8, 1, 9], "expected_output": "1"}
        ],
        "hidden_test_cases": [
            {"input": [-3, 0, 5], "expected_output": "-3"}
        ]
    },
    {
        "problem_number": 7,
        "title": "FizzBuzz",
        "slug": "fizz-buzz",
        "difficulty": "Easy",
        "category": "String",
        "description": "Given an integer `n`, return a string array `answer` (1-indexed) where:\n- `answer[i] == \"FizzBuzz\"` if `i` is divisible by 3 and 5.\n- `answer[i] == \"Fizz\"` if `i` is divisible by 3.\n- `answer[i] == \"Buzz\"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.",
        "examples": [
            {"input": "3", "output": "[\"1\", \"2\", \"Fizz\"]", "explanation": "3 is divisible by 3."},
            {"input": "5", "output": "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]", "explanation": "5 is divisible by 5."}
        ],
        "constraints": ["1 <= n <= 10^4"],
        "starter_code": {
            "python": "def fizz_buzz(n):\n    res = []\n    for i in range(1, n + 1):\n        if i % 3 == 0 and i % 5 == 0:\n            res.append(\"FizzBuzz\")\n        elif i % 3 == 0:\n            res.append(\"Fizz\")\n        elif i % 5 == 0:\n            res.append(\"Buzz\")\n        else:\n            res.append(str(i))\n    return res",
            "javascript": "function fizzBuzz(n) {\n    const res = [];\n    for (let i = 1; i <= n; i++) {\n        if (i % 15 === 0) res.push(\"FizzBuzz\");\n        else if (i % 3 === 0) res.push(\"Fizz\");\n        else if (i % 5 === 0) res.push(\"Buzz\");\n        else res.push(String(i));\n    }\n    return res;\n}",
            "java": "class Solution {\n    public List<String> fizzBuzz(int n) {\n        return new ArrayList<>();\n    }\n}",
            "cpp": "vector<string> fizzBuzz(int n) {\n    return {};\n}"
        },
        "test_cases": [
            {"input": 3, "expected_output": "[\"1\", \"2\", \"Fizz\"]"},
            {"input": 5, "expected_output": "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]"}
        ],
        "hidden_test_cases": [
            {"input": 15, "expected_output": "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\", \"Fizz\", \"7\", \"8\", \"Fizz\", \"Buzz\", \"11\", \"Fizz\", \"13\", \"14\", \"FizzBuzz\"]"}
        ]
    },
    {
        "problem_number": 8,
        "title": "Factorial",
        "slug": "factorial",
        "difficulty": "Easy",
        "category": "Math",
        "description": "Given a non-negative integer `n`, compute and return its factorial `n!`.\nNote: `0!` equals `1`.",
        "examples": [
            {"input": "5", "output": "120", "explanation": "5! = 5 * 4 * 3 * 2 * 1 = 120."},
            {"input": "0", "output": "1", "explanation": "0! = 1."}
        ],
        "constraints": ["0 <= n <= 20"],
        "starter_code": {
            "python": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
            "javascript": "function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}",
            "java": "class Solution {\n    public long factorial(int n) {\n        long f = 1;\n        for(int i=2; i<=n; i++) f *= i;\n        return f;\n    }\n}",
            "cpp": "long long factorial(int n) {\n    long long f = 1;\n    for(int i=2; i<=n; i++) f *= i;\n    return f;\n}"
        },
        "test_cases": [
            {"input": 5, "expected_output": "120"},
            {"input": 0, "expected_output": "1"}
        ],
        "hidden_test_cases": [
            {"input": 1, "expected_output": "1"},
            {"input": 6, "expected_output": "720"}
        ]
    },
    {
        "problem_number": 9,
        "title": "Fibonacci Number",
        "slug": "fibonacci-number",
        "difficulty": "Easy",
        "category": "Dynamic Programming",
        "description": "The Fibonacci numbers, commonly denoted `F(n)` form a sequence such that each number is the sum of the two preceding ones, starting from `0` and `1`. That is:\n- `F(0) = 0`, `F(1) = 1`\n- `F(n) = F(n - 1) + F(n - 2)`, for `n > 1`.\n\nGiven `n`, calculate `F(n)`.",
        "examples": [
            {"input": "2", "output": "1", "explanation": "F(2) = F(1) + F(0) = 1 + 0 = 1."},
            {"input": "4", "output": "3", "explanation": "F(4) = F(3) + F(2) = 2 + 1 = 3."}
        ],
        "constraints": ["0 <= n <= 30"],
        "starter_code": {
            "python": "def fib(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b",
            "javascript": "function fib(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}",
            "java": "class Solution {\n    public int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n}",
            "cpp": "int fib(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}"
        },
        "test_cases": [
            {"input": 2, "expected_output": "1"},
            {"input": 4, "expected_output": "3"}
        ],
        "hidden_test_cases": [
            {"input": 0, "expected_output": "0"},
            {"input": 10, "expected_output": "55"}
        ]
    },
    {
        "problem_number": 10,
        "title": "Binary Search",
        "slug": "binary-search",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
        "examples": [
            {"input": "[-1, 0, 3, 5, 9, 12], 9", "output": "4", "explanation": "9 exists in nums and its index is 4."},
            {"input": "[-1, 0, 3, 5, 9, 12], 2", "output": "-1", "explanation": "2 does not exist in nums so return -1."}
        ],
        "constraints": ["1 <= nums.length <= 10^4", "All elements in nums are unique."],
        "starter_code": {
            "python": "def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
            "javascript": "function search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n        let mid = Math.floor((left + right) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
            "java": "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}",
            "cpp": "int search(vector<int>& nums, int target) {\n    return -1;\n}"
        },
        "test_cases": [
            {"input": [[-1, 0, 3, 5, 9, 12], 9], "expected_output": "4"},
            {"input": [[-1, 0, 3, 5, 9, 12], 2], "expected_output": "-1"}
        ],
        "hidden_test_cases": [
            {"input": [[5], 5], "expected_output": "0"}
        ]
    },
    {
        "problem_number": 11,
        "title": "Merge Two Sorted Arrays",
        "slug": "merge-two-sorted-arrays",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given two sorted integer arrays `arr1` and `arr2`, merge them into a single sorted array and return it.",
        "examples": [
            {"input": "[1, 3, 5], [2, 4, 6]", "output": "[1, 2, 3, 4, 5, 6]", "explanation": "Merged sorted result is [1, 2, 3, 4, 5, 6]."}
        ],
        "constraints": ["0 <= arr1.length, arr2.length <= 10^4"],
        "starter_code": {
            "python": "def merge_sorted(arr1, arr2):\n    return sorted(arr1 + arr2)",
            "javascript": "function mergeSorted(arr1, arr2) {\n    return [...arr1, ...arr2].sort((a, b) => a - b);\n}",
            "java": "class Solution {\n    public int[] mergeSorted(int[] arr1, int[] arr2) {\n        return new int[]{};\n    }\n}",
            "cpp": "vector<int> mergeSorted(vector<int>& arr1, vector<int>& arr2) {\n    vector<int> res = arr1;\n    res.insert(res.end(), arr2.begin(), arr2.end());\n    sort(res.begin(), res.end());\n    return res;\n}"
        },
        "test_cases": [
            {"input": [[1, 3, 5], [2, 4, 6]], "expected_output": "[1, 2, 3, 4, 5, 6]"}
        ],
        "hidden_test_cases": [
            {"input": [[], [1, 2]], "expected_output": "[1, 2]"}
        ]
    },
    {
        "problem_number": 12,
        "title": "Remove Duplicates",
        "slug": "remove-duplicates",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an array `nums`, remove the duplicates such that each element appears only once and return the new sorted array without duplicates.",
        "examples": [
            {"input": "[1, 1, 2]", "output": "[1, 2]", "explanation": "After removing duplicate 1, unique array is [1, 2]."}
        ],
        "constraints": ["1 <= nums.length <= 10^4"],
        "starter_code": {
            "python": "def remove_duplicates(nums):\n    return sorted(list(set(nums)))",
            "javascript": "function removeDuplicates(nums) {\n    return Array.from(new Set(nums)).sort((a, b) => a - b);\n}",
            "java": "class Solution {\n    public int[] removeDuplicates(int[] nums) {\n        return new int[]{};\n    }\n}",
            "cpp": "vector<int> removeDuplicates(vector<int>& nums) {\n    return {};\n}"
        },
        "test_cases": [
            {"input": [1, 1, 2], "expected_output": "[1, 2]"}
        ],
        "hidden_test_cases": [
            {"input": [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], "expected_output": "[0, 1, 2, 3, 4]"}
        ]
    },
    {
        "problem_number": 13,
        "title": "Valid Anagram",
        "slug": "valid-anagram",
        "difficulty": "Easy",
        "category": "String",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.",
        "examples": [
            {"input": "\"anagram\", \"nagaram\"", "output": "true", "explanation": "Both strings contain exact same characters."},
            {"input": "\"rat\", \"car\"", "output": "false", "explanation": "'rat' and 'car' do not match."}
        ],
        "constraints": ["1 <= s.length, t.length <= 5 * 10^4"],
        "starter_code": {
            "python": "def is_anagram(s, t):\n    return sorted(s) == sorted(t)",
            "javascript": "function isAnagram(s, t) {\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}",
            "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return true;\n    }\n}",
            "cpp": "bool isAnagram(string s, string t) {\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t;\n}"
        },
        "test_cases": [
            {"input": ["anagram", "nagaram"], "expected_output": "true"},
            {"input": ["rat", "car"], "expected_output": "false"}
        ],
        "hidden_test_cases": [
            {"input": ["listen", "silent"], "expected_output": "true"}
        ]
    },
    {
        "problem_number": 14,
        "title": "First Unique Character",
        "slug": "first-unique-character",
        "difficulty": "Easy",
        "category": "String",
        "description": "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
        "examples": [
            {"input": "\"leetcode\"", "output": "0", "explanation": "Character 'l' at index 0 is the first unique character."},
            {"input": "\"loveleetcode\"", "output": "2", "explanation": "Character 'v' at index 2 is the first unique character."}
        ],
        "constraints": ["1 <= s.length <= 10^5"],
        "starter_code": {
            "python": "def first_uniq_char(s):\n    from collections import Counter\n    count = Counter(s)\n    for idx, ch in enumerate(s):\n        if count[ch] == 1:\n            return idx\n    return -1",
            "javascript": "function firstUniqChar(s) {\n    for (let i = 0; i < s.length; i++) {\n        if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;\n    }\n    return -1;\n}",
            "java": "class Solution {\n    public int firstUniqChar(String s) {\n        return -1;\n    }\n}",
            "cpp": "int firstUniqChar(string s) {\n    return -1;\n}"
        },
        "test_cases": [
            {"input": "leetcode", "expected_output": "0"},
            {"input": "loveleetcode", "expected_output": "2"}
        ],
        "hidden_test_cases": [
            {"input": "aabb", "expected_output": "-1"}
        ]
    },
    {
        "problem_number": 15,
        "title": "Reverse Linked List",
        "slug": "reverse-linked-list",
        "difficulty": "Easy",
        "category": "Linked List",
        "description": "Given the array representation of a linked list `head`, reverse the list and return the reversed array.",
        "examples": [
            {"input": "[1, 2, 3, 4, 5]", "output": "[5, 4, 3, 2, 1]", "explanation": "Reversing [1,2,3,4,5] yields [5,4,3,2,1]."}
        ],
        "constraints": ["0 <= list.length <= 5000"],
        "starter_code": {
            "python": "def reverse_list(head):\n    return head[::-1]",
            "javascript": "function reverseList(head) {\n    return head.slice().reverse();\n}",
            "java": "class Solution {\n    public int[] reverseList(int[] head) {\n        return new int[]{};\n    }\n}",
            "cpp": "vector<int> reverseList(vector<int>& head) {\n    reverse(head.begin(), head.end());\n    return head;\n}"
        },
        "test_cases": [
            {"input": [1, 2, 3, 4, 5], "expected_output": "[5, 4, 3, 2, 1]"}
        ],
        "hidden_test_cases": [
            {"input": [1, 2], "expected_output": "[2, 1]"}
        ]
    },
    {
        "problem_number": 16,
        "title": "Maximum Subarray",
        "slug": "maximum-subarray",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        "examples": [
            {"input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", "output": "6", "explanation": "Subarray [4, -1, 2, 1] has the largest sum 6."}
        ],
        "constraints": ["1 <= nums.length <= 10^5"],
        "starter_code": {
            "python": "def max_sub_array(nums):\n    max_sum = current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum",
            "javascript": "function maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currentSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}",
            "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}",
            "cpp": "int maxSubArray(vector<int>& nums) {\n    return 0;\n}"
        },
        "test_cases": [
            {"input": [-2, 1, -3, 4, -1, 2, 1, -5, 4], "expected_output": "6"}
        ],
        "hidden_test_cases": [
            {"input": [1], "expected_output": "1"},
            {"input": [5, 4, -1, 7, 8], "expected_output": "23"}
        ]
    },
    {
        "problem_number": 17,
        "title": "Climbing Stairs",
        "slug": "climbing-stairs",
        "difficulty": "Easy",
        "category": "Dynamic Programming",
        "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "examples": [
            {"input": "2", "output": "2", "explanation": "There are two ways: 1 step + 1 step, or 2 steps."},
            {"input": "3", "output": "3", "explanation": "Three ways: (1+1+1), (1+2), (2+1)."}
        ],
        "constraints": ["1 <= n <= 45"],
        "starter_code": {
            "python": "def climb_stairs(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b",
            "javascript": "function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}",
            "java": "class Solution {\n    public int climbStairs(int n) {\n        return n;\n    }\n}",
            "cpp": "int climbStairs(int n) {\n    return n;\n}"
        },
        "test_cases": [
            {"input": 2, "expected_output": "2"},
            {"input": 3, "expected_output": "3"}
        ],
        "hidden_test_cases": [
            {"input": 5, "expected_output": "8"}
        ]
    },
    {
        "problem_number": 18,
        "title": "Best Time to Buy and Sell Stock",
        "slug": "best-time-to-buy-and-sell-stock",
        "difficulty": "Easy",
        "category": "Array",
        "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        "examples": [
            {"input": "[7, 1, 5, 3, 6, 4]", "output": "5", "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."}
        ],
        "constraints": ["1 <= prices.length <= 10^5"],
        "starter_code": {
            "python": "def max_profit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_profit:\n            max_profit = p - min_price\n    return max_profit",
            "javascript": "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}",
            "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}",
            "cpp": "int maxProfit(vector<int>& prices) {\n    return 0;\n}"
        },
        "test_cases": [
            {"input": [7, 1, 5, 3, 6, 4], "expected_output": "5"}
        ],
        "hidden_test_cases": [
            {"input": [7, 6, 4, 3, 1], "expected_output": "0"}
        ]
    },
    {
        "problem_number": 19,
        "title": "Contains Duplicate",
        "slug": "contains-duplicate",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
        "examples": [
            {"input": "[1, 2, 3, 1]", "output": "true", "explanation": "1 appears twice."},
            {"input": "[1, 2, 3, 4]", "output": "false", "explanation": "All elements are unique."}
        ],
        "constraints": ["1 <= nums.length <= 10^5"],
        "starter_code": {
            "python": "def contains_duplicate(nums):\n    return len(nums) != len(set(nums))",
            "javascript": "function containsDuplicate(nums) {\n    return new Set(nums).size !== nums.length;\n}",
            "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}",
            "cpp": "bool containsDuplicate(vector<int>& nums) {\n    return false;\n}"
        },
        "test_cases": [
            {"input": [1, 2, 3, 1], "expected_output": "true"},
            {"input": [1, 2, 3, 4], "expected_output": "false"}
        ],
        "hidden_test_cases": [
            {"input": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2], "expected_output": "true"}
        ]
    },
    {
        "problem_number": 20,
        "title": "Move Zeroes",
        "slug": "move-zeroes",
        "difficulty": "Easy",
        "category": "Array",
        "description": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nReturn the modified array.",
        "examples": [
            {"input": "[0, 1, 0, 3, 12]", "output": "[1, 3, 12, 0, 0]", "explanation": "Non-zero elements 1, 3, 12 are kept at beginning while 0s are pushed to end."}
        ],
        "constraints": ["1 <= nums.length <= 10^4"],
        "starter_code": {
            "python": "def move_zeroes(nums):\n    non_zeros = [x for x in nums if x != 0]\n    zeros = [0] * (len(nums) - len(non_zeros))\n    return non_zeros + zeros",
            "javascript": "function moveZeroes(nums) {\n    const nonZeros = nums.filter(x => x !== 0);\n    const zeros = new Array(nums.length - nonZeros.length).fill(0);\n    return nonZeros.concat(zeros);\n}",
            "java": "class Solution {\n    public int[] moveZeroes(int[] nums) {\n        return new int[]{};\n    }\n}",
            "cpp": "vector<int> moveZeroes(vector<int>& nums) {\n    return {};\n}"
        },
        "test_cases": [
            {"input": [0, 1, 0, 3, 12], "expected_output": "[1, 3, 12, 0, 0]"}
        ],
        "hidden_test_cases": [
            {"input": [0], "expected_output": "[0]"}
        ]
    }
]
