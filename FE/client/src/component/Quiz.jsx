
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz.css";
import { BACKEND_URL } from "../config";

function Quiz() {
    const [selectedTopic, setSelectedTopic] = useState("");
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(null);
    const [quizOver, setQuizOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [usedQuestions, setUsedQuestions] = useState([]);

    const TOTAL_QUESTIONS = 5;
    console.log("Backend URL is:", BACKEND_URL);

    if (!BACKEND_URL) {
        console.warn(" BACKEND_URL is undefined! Check your .env file and restart the dev server.");
    }


    const startQuiz = () => {
        setQuestionNumber(0);
        setScore(0);
        setQuizOver(false);
        setSelectedAnswer(null);
        setUsedQuestions([]);
        fetchQuestion(0);
    };

    const fetchQuestion = async (qNum) => {
        setLoading(true);
        setSelectedAnswer(null);


        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/chat`,
                { selectedTopic }
            );

            if (!res.data.response) {
                return "not found"
            }
            console.log(res)
            const raw = res.data.response;
            console.log(raw)
            const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

            const qLine = lines.find(line => /^Q[:.]/i.test(line));
            const questionText = qLine?.replace(/^Q[:.]\s*/, "") || "";

            if (usedQuestions.includes(questionText)) {
                fetchQuestion(qNum); // skip duplicate
                return;
            }

            const opts = [];
            for (let line of lines) {
                const match = line.match(/^([A-D])\.\s*(.*)/);
                if (match) opts.push(match[2]);
                if (opts.length === 4) break;
            }

            const correctLine = lines.find(line => /correct answer[:]?/i.test(line));
            let correctLetter = correctLine?.match(/[A-D]/i)?.[0]?.toUpperCase() || null;
            let correctIndex = correctLetter ? correctLetter.charCodeAt(0) - 65 : null;

            // Shuffle options so correct answer is random
            if (opts.length === 4 && correctIndex !== null) {
                const shuffled = opts
                    .map((text, idx) => ({ text, isCorrect: idx === correctIndex }))
                    .sort(() => Math.random() - 0.5);
                correctIndex = shuffled.findIndex(o => o.isCorrect);
                const shuffledOpts = shuffled.map(o => o.text);
                setOptions(shuffledOpts);
            } else {
                setOptions(opts);
            }

            setUsedQuestions(prev => [...prev, questionText]);
            setQuestion(questionText);
            setCorrectAnswer(correctIndex);

        } catch (err) {
            console.error("❌ Error fetching question:", err);
            setQuestion("Failed to load question. Retrying...");
            setOptions([]);
            setCorrectAnswer(null);
            setTimeout(() => fetchQuestion(qNum), 5000); // Retry after 5 sec
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (question && selectedAnswer === null) {
            setCountdown(15);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setQuizOver(true);
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimer(interval);
        }
        return () => clearInterval(timer);
    }, [question, selectedAnswer]);

    const handleAnswer = (idx) => {
        clearInterval(timer);
        setSelectedAnswer(idx);
        if (idx === correctAnswer) setScore(prev => prev + 1);

        setTimeout(() => {
            if (questionNumber + 1 >= TOTAL_QUESTIONS) setQuizOver(true);
            else {
                const nextQ = questionNumber + 1;
                setQuestionNumber(nextQ);
                setSelectedAnswer(null);
                fetchQuestion(nextQ);
            }
        }, 1000);
    };

    return (
        <div className="quiz-container">
            <h1>AI-Powered Quiz App</h1>

            {!selectedTopic ? (
                <>
                    <h2>Select Topic:</h2>
                    <button onClick={() => setSelectedTopic("JavaScript")}>JavaScript</button>
                    <button onClick={() => setSelectedTopic("React")}>React</button>
                    <button onClick={() => setSelectedTopic("Python")}>Python</button>
                </>
            ) : quizOver ? (
                <>
                    <h2>Quiz Over!</h2>
                    <p>Score: {score} / {TOTAL_QUESTIONS}</p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={() => {
                            setQuestionNumber(0);
                            setScore(0);
                            setQuizOver(false);
                            setSelectedAnswer(null);
                            fetchQuestion(0);
                        }}>Restart Quiz</button>

                        <button onClick={() => {
                            setSelectedTopic("");
                            setQuestion("");
                            setOptions([]);
                            setUsedQuestions([]);
                            setCorrectAnswer(null);
                            setSelectedAnswer(null);
                            setScore(0);
                            setQuizOver(false);
                        }}>Choose Another Topic</button>
                    </div>
                </>
            ) : question ? (
                <div className="question-container">
                    <p><strong>Q{questionNumber + 1}:</strong> {question}</p>
                    <p className={`timer ${countdown <= 5 ? "red" : "green"}`}>
                        Time left: {countdown}s
                    </p>
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={`option-button ${selectedAnswer !== null
                                ? idx === correctAnswer
                                    ? "correct"
                                    : idx === selectedAnswer
                                        ? "wrong"
                                        : ""
                                : ""
                                }`}
                            onClick={() => handleAnswer(idx)}
                            disabled={selectedAnswer !== null}
                        >
                            {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                    ))}
                </div>
            ) : (
                <button onClick={startQuiz} disabled={loading}>
                    {loading ? "Loading..." : "Start Quiz"}
                </button>
            )}
        </div>
    );
}

export default Quiz;
