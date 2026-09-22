import os
import json
import re

class AIService:
    """
    AI Service providing Hint generation, Code Explanation, Debugging,
    Concept Learning, and AI Problem Generation.
    Uses OpenAI API if OPENAI_API_KEY is available, with intelligent fallback rules.
    """

    @classmethod
    def get_api_key(cls):
        return os.environ.get('OPENAI_API_KEY', '').strip()

    @classmethod
    def _call_openai(cls, system_prompt, user_prompt):
        api_key = cls.get_api_key()
        if not api_key:
            return None
        
        try:
            import urllib.request
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            data = {
                "model": os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7
            }
            req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                res_body = response.read().decode('utf-8')
                res_json = json.loads(res_body)
                return res_json['choices'][0]['message']['content'].strip()
        except Exception as e:
            print(f"[AIService] OpenAI API call fallback due to: {e}")
            return None

    @classmethod
    def generate_hint(cls, problem_title, problem_category, problem_description, hints_list, current_hint_level):
        """
        Progressive hints without giving away the full solution immediately.
        """
        system_prompt = "You are a friendly, encouraging AI Coding Tutor. Give a progressive hint to help the user solve the problem without revealing the complete solution code."
        user_prompt = f"Problem: {problem_title}\nCategory: {problem_category}\nDescription: {problem_description}\nRequested Hint Level: {current_hint_level}"

        ai_res = cls._call_openai(system_prompt, user_prompt)
        if ai_res:
            return {"hint_level": current_hint_level, "hint": ai_res}

        # Fallback progressive hint response
        if hints_list and len(hints_list) >= current_hint_level:
            return {
                "hint_level": current_hint_level,
                "hint": hints_list[current_hint_level - 1]
            }

        fallback_hints = {
            1: f"💡 **Conceptual Hint (Level 1)**: Think about the core data structure needed for {problem_category}. What properties make operations like lookup or insertion fast?",
            2: f"🔍 **Algorithmic Hint (Level 2)**: Consider iterating through the data step by step. Can you maintain state or cache previous values to avoid redundant work?",
            3: f"🧠 **Optimization Hint (Level 3)**: Notice any edge cases (empty inputs, single element, negative numbers). Try balancing Time Complexity with Space Complexity."
        }
        return {
            "hint_level": current_hint_level,
            "hint": fallback_hints.get(current_hint_level, "Work through the problem example line-by-line with pencil and paper to observe pattern behavior.")
        }

    @classmethod
    def explain_code(cls, problem_title, user_code, language):
        """
        Explains user code, key logic, time complexity, space complexity, and potential improvements.
        """
        system_prompt = "You are an expert AI Code Reviewer. Analyze the user's code and explain: 1. Overview 2. Core Logic 3. Time Complexity 4. Space Complexity 5. Suggested Optimizations."
        user_prompt = f"Problem: {problem_title}\nLanguage: {language}\nCode:\n{user_code}"

        ai_res = cls._call_openai(system_prompt, user_prompt)
        if ai_res:
            return {"explanation": ai_res}

        # Intelligent Fallback Breakdown
        lines_count = len([l for l in user_code.splitlines() if l.strip()])
        has_loops = any(k in user_code for k in ['for', 'while'])
        has_recursion = 'return' in user_code and '(' in user_code and problem_title.lower().split()[0] in user_code.lower()
        has_map = any(k in user_code for k in ['dict', 'Map', 'Set', 'unordered_map', '{}', 'new Map'])

        time_comp = "O(N²)" if user_code.count("for") > 1 or user_code.count("while") > 1 else ("O(N)" if has_loops else "O(1)")
        space_comp = "O(N)" if has_map else "O(1)"

        fallback = f"""### 📘 Code Explanation & Review

**Overview & Structure:**
Your solution is written in **{language.upper()}** and contains approximately **{lines_count} lines** of active code.

**Key Logic Breakdown:**
1. **Entry Point**: The function receives the input dataset and initializes necessary trackers/pointers.
2. **Execution Flow**: { 'Iterates through elements sequentially to process constraints.' if has_loops else 'Executes direct computations/conditional checks.' }
3. **Data Storage**: { 'Utilizes auxiliary memory (hash map / set / array) to achieve fast lookups.' if has_map else 'Operates with in-place variables for memory efficiency.' }

---

### ⏱️ Complexity Analysis
- **Time Complexity**: `{time_comp}` — { 'Loops nested over the input size.' if time_comp == 'O(N²)' else 'Single linear traversal over elements.' }
- **Space Complexity**: `{space_comp}` — { 'Requires extra space proportional to input size.' if has_map else 'Constant auxiliary space.' }

---

### 💡 Potential Improvements
- Verify edge cases like `null`/empty input arrays or maximum bound limits.
- Ensure descriptive variable names to maintain clean code readability.
"""
        return {"explanation": fallback}

    @classmethod
    def debug_code(cls, problem_title, user_code, error_message, language):
        """
        Identifies syntax errors, logical bugs, edge cases, and performance issues.
        """
        system_prompt = "You are an AI Debugging Assistant. Help the user diagnose why their code fails. Highlight syntax/logic errors, edge cases, and provide actionable fixes."
        user_prompt = f"Problem: {problem_title}\nLanguage: {language}\nError Output: {error_message}\nCode:\n{user_code}"

        ai_res = cls._call_openai(system_prompt, user_prompt)
        if ai_res:
            return {"debug_analysis": ai_res}

        # Smart Debugger Heuristics
        bugs = []
        if not user_code.strip() or 'pass' in user_code:
            bugs.append("⚠️ **Unimplemented Code**: Function body contains only placeholders or `pass`.")
        if 'return' not in user_code:
            bugs.append("🚨 **Missing Return Statement**: Your function executes without returning an explicit output value.")
        if error_message:
            bugs.append(f"💥 **Execution Error Captured**: `{error_message}`")

        if not bugs:
            bugs.append("🔍 **Logical Mismatch / Edge Case**: The code executes cleanly but returned an output different from the test case's expected output. Check boundary index conditions (`i < n` vs `i <= n`) or off-by-one errors.")

        fallback = f"""### 🛠️ AI Debugging Diagnosis

**Problem Context**: {problem_title} ({language.upper()})

#### Identified Potential Issues:
{chr(10).join(bugs)}

---

#### 🧪 Troubleshooting Checklist:
1. **Edge Cases**: Test with empty input `[]`, zero `0`, or negative integer values.
2. **Loop Bounds**: Verify that array index lookups remain strictly within valid bounds.
3. **Return Type**: Confirm the output matches expected JSON structure (e.g. array `[0, 1]` vs single integer).
"""
        return {"debug_analysis": fallback}

    @classmethod
    def teach_concept(cls, topic, user_question, problem_title):
        """
        Teaches underlying computer science algorithms and data structures.
        """
        system_prompt = "You are a Computer Science Professor. Explain the requested concept clearly with simple analogies, diagrams (in markdown), time complexity, and practical applications."
        user_prompt = f"Topic: {topic}\nProblem context: {problem_title}\nQuestion: {user_question}"

        ai_res = cls._call_openai(system_prompt, user_prompt)
        if ai_res:
            return {"concept_lesson": ai_res}

        fallback = f"""### 🎓 Learning Mode: Understanding **{topic}**

**Concept Overview:**
{topic} is a foundational computer science paradigm used to solve complex computational problems efficiently.

#### 💡 Core Analogy:
Think of **{topic}** like keeping an organized lookup table or index card system. Instead of searching through every single book in a library, you go directly to the catalog drawer!

#### 🔑 Key Characteristics & Principles:
- **Efficiency**: Reduces time complexity from brute force searching down to logarithmic or constant time.
- **Trade-offs**: Often trades a small amount of extra memory (space) to gain substantial speed (time).

#### 📊 Standard Complexity:
- **Average Time**: `O(1)` or `O(log N)` depending on implementation.
- **Space**: `O(N)` for dynamic allocations.

#### 🚀 Common Applications:
- Instant data lookups & caching.
- Pathfinding & state management.
- Dynamic optimization problems.
"""
        return {"concept_lesson": fallback}

    @classmethod
    def generate_problem(cls, topic, difficulty, language, concept):
        """
        AI Problem Generator producing structured coding problems.
        """
        system_prompt = "You are a Technical Problem Writer for competitive programming platforms. Generate a novel coding problem in JSON format matching the specified parameters."
        user_prompt = f"Topic: {topic}\nDifficulty: {difficulty}\nTarget Language: {language}\nConcept Focus: {concept}"

        ai_res = cls._call_openai(system_prompt, user_prompt)
        if ai_res:
            try:
                # Extract json block if present
                match = re.search(r'\{.*\}', ai_res, re.DOTALL)
                if match:
                    parsed = json.loads(match.group(0))
                    return parsed
            except Exception as e:
                print(f"[AIService] JSON parse error from OpenAI response: {e}")

        # Intelligent Fallback Problem Generator
        slug = f"{topic.lower().replace(' ', '-')}-{difficulty.lower()}-{concept.lower().replace(' ', '-')}"
        title = f"{topic}: {concept.title()} Challenge"

        return {
            "title": title,
            "slug": slug,
            "difficulty": difficulty,
            "category": topic,
            "description": f"Given an input dataset, implement an efficient algorithm focused on **{concept}** within **{topic}**.",
            "examples": [
                {
                    "input": "[2, 7, 11, 15], target = 9",
                    "output": "[0, 1]",
                    "explanation": "Because array[0] + array[1] == 9, we return [0, 1]."
                }
            ],
            "constraints": [
                "1 <= input.length <= 10^4",
                "-10^9 <= element <= 10^9"
            ],
            "starter_code": {
                "python": f"def solve(nums, target):\n    # Write your solution using {topic} concept\n    pass\n",
                "javascript": f"function solve(nums, target) {{\n    // Write your solution using {topic} concept\n    return [];\n}}\n",
                "java": f"class Solution {{\n    public int[] solve(int[] nums, int target) {{\n        // Write solution using {topic}\n        return new int[]{{}};\n    }}\n}}\n",
                "cpp": f"#include <vector>\nusing namespace std;\n\nclass Solution {{\npublic:\n    vector<int> solve(vector<int>& nums, int target) {{\n        return {{}};\n    }}\n}};\n"
            },
            "test_cases": [
                {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expected_output": "[0, 1]"},
                {"input": {"nums": [3, 2, 4], "target": 6}, "expected_output": "[1, 2]"}
            ],
            "hidden_test_cases": [
                {"input": {"nums": [3, 3], "target": 6}, "expected_output": "[0, 1]"}
            ],
            "hints": [
                f"Consider how {topic} stores element indexes for constant-time lookup.",
                "Can you check if the target complement already exists before storing the current element?"
            ],
            "solution_explanation": f"Iterate through the array while storing visited values in a map. For each number x, check if (target - x) exists in the map.",
            "time_complexity": "O(N)",
            "space_complexity": "O(N)"
        }
