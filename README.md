# AI-Powered Quiz App 

A modern quiz application built with **React.js** and **Node.js**, featuring dynamic question generation using **GenAI (Hugging Face API)**.  
Showcase your full-stack skills and experience with AI integration!

---

## Features

- **Topic Selection:** Choose JavaScript, React, or Python before starting the quiz.
- **AI-Generated Questions:** Questions are fetched in real-time from the backend using Hugging Face GenAI models.
- **Multiple Choice Questions:** Four options per question, with instant feedback.
- **Countdown Timer:** 15 seconds per question, timer color changes as time runs out.
- **Scoring System:** Score updates for every correct answer.
- **Quiz Over Screen:** See your final score and restart or change topic.
- **Loading State:** "Loading..." indicator while fetching questions.
- **Responsive UI:** Clean, professional, and mobile-friendly.
- **Error Handling:** Automatic retry if question fails to load.
- **Extensible:** Easily add more topics or question types.

---

## Tech Stack

- **Frontend:** React.js, Axios, CSS
- **Backend:** Node.js, Express, Hugging Face GenAI API
- **Other:** Vite, dotenv, CORS

---

## Why Is This Useful?

- **Demonstrates Modern React Patterns:** Hooks, state management, and effects.
- **Real API Integration:** Connects to a backend for dynamic, AI-generated content.
- **Professional UI/UX:** Clean interface, responsive design, and interactive feedback.
- **Extensible:** Easily add more topics or question types..

---

## How to Run

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/react-ai-quiz-app.git
cd react-ai-quiz-app
```

### 2. Setup Backend

```sh
cd BE/Server
npm install
# Add your Hugging Face API key to .env:
echo HUGGINGFACE_API_KEY=your_huggingface_api_key > .env
npm start
```
Backend runs at `http://localhost:5000`

### 3. Setup Frontend

```sh
cd ../../FE/Client
npm install
# Optionally set backend URL in .env:
echo VITE_REACT_APP_BACKEND_URL=http://localhost:5000 > .env
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## How to Use

1. **Open Frontend in Browser:**  
   Visit [http://localhost:5173](http://localhost:5173)
2. **Select a Topic:**  
   Choose JavaScript, React, or Python.
3. **Answer Questions:**  
   Select your answer before the timer runs out.
4. **View Score:**  
   See your score at the end and restart or change topic.

---

## Contact

For queries, reach out at [your.email@example.com](mailto:your.email@example.com)

---




