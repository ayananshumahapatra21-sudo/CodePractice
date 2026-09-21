# CodePractice 🚀

> A full-stack competitive coding & algorithmic practice platform inspired by LeetCode. Built with **React 18**, **Vite**, **Tailwind CSS**, **Monaco Code Editor**, **Django REST Framework**, and a secure **Sandboxed Code Execution Engine**.

---

## 🌟 Key Features

* **Curated Problem Set**: Pre-populated with **20 beginner-to-intermediate algorithm challenges** (Two Sum, Reverse String, Valid Parentheses, Binary Search, Maximum Subarray, etc.).
* **Multi-Language Monaco Editor**: Browser code editor with syntax highlighting, line numbers, auto-indentation, light/dark themes, and starter code for **Python 3**, **JavaScript (ES6)**, **Java 17**, and **C++**.
* **Parallel Execution Engine**: Concurrently executes submitted code against sample and hidden test cases using process isolation with 3.0s timeout limits.
* **Instant Feedback**: Displays execution runtime (ms), passed test case counts, expected vs. actual outputs, compilation errors, and stack traces.
* **User Dashboard & Analytics**: Tracks problems solved by difficulty (*Easy*, *Medium*, *Hard*), daily practice streak, acceptance rates, and recent submission history.
* **JWT Authentication**: Secure user registration, login, token refresh, and profile management.
* **Interactive Filters**: Search problems by title/number, filter by difficulty tab, or filter by category tags (*Array*, *String*, *Linked List*, *Stack*, *Queue*, *Tree*, *Graph*, *Dynamic Programming*).

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: React 18 + Vite
* **Styling**: Tailwind CSS (Dark Mode by default)
* **Code Editor**: `@monaco-editor/react`
* **Icons**: `lucide-react`
* **HTTP Client**: `axios` with JWT Bearer Token interceptors
* **Routing**: `react-router-dom`

### Backend
* **Framework**: Django 5.0 + Django REST Framework
* **Auth**: `djangorestframework-simplejwt`
* **CORS**: `django-cors-headers`
* **Database**: SQLite3 (default) / PostgreSQL compatible
* **Execution Runner**: Sandboxed process runner with `concurrent.futures.ThreadPoolExecutor` parallelization

---

## 📂 Repository Structure

```text
CodePractice/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   ├── codepractice/               # Main Django configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/                        # REST API app
│       ├── models.py               # Problem, Submission, UserProgress models
│       ├── runner.py               # Parallel Sandboxed Execution Engine
│       ├── serializers.py          # REST Serializers
│       ├── seed_data.py            # 20 Seed Coding Problems
│       ├── views.py                # Auth, Problems, Run, Submit, Dashboard
│       ├── urls.py                 # API Routing
│       └── management/commands/
│           └── seed_problems.py
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/AuthContext.jsx # Auth state Provider
        ├── services/api.js         # API client
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── MonacoCodeEditor.jsx
        │   ├── ProblemCard.jsx
        │   ├── StatCard.jsx
        │   ├── TestResultsPanel.jsx
        │   └── FilterBar.jsx
        └── pages/
            ├── HomePage.jsx
            ├── ProblemsPage.jsx
            ├── ProblemDetailPage.jsx
            ├── DashboardPage.jsx
            ├── LoginPage.jsx
            └── RegisterPage.jsx
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
* Python 3.10+
* Node.js 18+

### 2. Backend Setup (Django REST API)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Run migrations & seed 20 problems
python manage.py migrate
python manage.py seed_problems

# Start backend server
python manage.py runserver 8000
```
> Django API will run at `http://127.0.0.1:8000/api/`

---

### 3. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
> React Frontend will run at `http://localhost:5173/`

---

## 📡 Key REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | Register a new user |
| `/api/auth/login/` | `POST` | Log in and receive JWT pair |
| `/api/auth/me/` | `GET` | Get current authenticated user profile |
| `/api/problems/` | `GET` | List problems (supports `search`, `difficulty`, `category`) |
| `/api/problems/<id>/` | `GET` | Fetch single problem details & starter code |
| `/api/problems/stats/` | `GET` | Fetch global platform question metrics |
| `/api/run/` | `POST` | Run code against sample test cases |
| `/api/submit/` | `POST` | Evaluate solution against hidden test cases |
| `/api/dashboard/` | `GET` | Fetch user progress, difficulty stats & recent submissions |

---

## 📄 License

This project is licensed under the MIT License.
