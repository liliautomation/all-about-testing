# Test Task Checklist Generator

A simple full-stack app that generates QA task checklists from a task title using a rules-based engine.

## 🧰 Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/qa-task-generator.git
cd qa-task-generator
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
pnpm install
```

#### Frontend
```bash
cd ../frontend
pnpm install
```

### 3. Run the App

#### Backend (localhost:3000)
```bash
pnpm run dev
```

#### Frontend (localhost:5173)
```bash
pnpm run dev
```

> The frontend will make requests to `http://localhost:3000/api/checklist`.

## 🧪 Example

**Input:**  
`title: Reset password from forgot password screen`

**Generated Checklist:**
- Verify 'Forgot Password' UI is visible
- Validate email input field and button behavior
- Test successful reset flow (email sent)
- Check error cases (invalid email, server error)
- Ensure success message is shown
- Test across major browsers and devices

## 📁 Project Structure
```
qa-task-generator/
├── backend/        # Express API
└── frontend/       # React UI
```

## 📌 Notes
- Make sure ports 3000 and 5173 are free
- CORS is enabled for local development

## 🔒 License
MIT