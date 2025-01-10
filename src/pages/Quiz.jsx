/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaClock, FaTrophy } from "react-icons/fa";
import { useParams } from "react-router-dom";
import EndingScreen from "../components/quiz/EndingScreen";

const Leaderboard = ({ leaderboard }) => {
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaTrophy className="mr-2 text-yellow-500" />
        Leaderboard
      </h2>
      <ul className="space-y-2">
        {sortedLeaderboard.map((entry, index) => (
          <li key={entry.user_id} className="flex justify-between items-center">
            <span className="font-medium">
              {index + 1}. {entry.username}
            </span>
            <span className="text-blue-600 font-bold">{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizReady, setQuizReady] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState(0);
  const [webSocket, setWebSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false); // Added new state variable
  let timePerQuestion = useRef(0);

  const { quizId } = useParams();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(`/api/v1/quiz/${quizId}`);
        const quizData = res.data?.data;
        if (quizData) {
          const startTime = new Date(quizData.live_time);
          const now = new Date();
          const timeDiff = Math.max(0, startTime.getTime() - now.getTime()) / 1000;
          setTimeUntilStart(timeDiff);
          if (timeDiff <= 0) {
            setQuizReady(true);
          }
          timePerQuestion.current = quizData.duration_seconds / quizData.question_count;
          console.log("timePerQuestion", timePerQuestion);
          connectWebSocket();
        }
      } catch (error) {
        console.error(error);
        window.location.assign("/home");
      }
    }

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeUntilStart <= 0) return;

    const timer = setInterval(() => {
      setTimeUntilStart((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setQuizReady(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeUntilStart]);

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/quiz/${quizId}/start`);
    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        // This is leaderboard data
        setLeaderboard(data);
      } else if (data.questionText) {
        // This is a new question
        setCurrentQuestion(data);
        setTimeLeft(timePerQuestion.current);
      }
      if (data.type === "quiz_ended") {
        // Quiz has ended
        setQuizEnded(true);
        setCurrentQuestion(null);
      }
    };
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    setWebSocket(ws);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = async (answer) => {
    if (currentQuestion) {
      await axios.post(`/api/v1/quiz/${quizId}/${currentQuestion.questionId}`, {
        solution: answer,
      });
      setCurrentQuestion(null); // Wait for the next question from WebSocket
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">Quiz Challenge</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow w-full lg:w-3/4">
          {!quizReady ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">The quiz will start soon!</h2>
              <div className="flex items-center justify-center text-xl">
                <FaClock className="mr-2" />
                <span>Time until start: {Math.ceil(timeUntilStart)}s</span>
              </div>
            </div>
          ) : quizEnded ? (
            <EndingScreen leaderboard={leaderboard} />
          ) : currentQuestion ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{currentQuestion.questionText}</h2>
                <div className="flex items-center text-lg font-medium text-blue-600">
                  <FaClock className="mr-2" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-2 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Waiting for the next question...</h2>
            </div>
          )}
        </div>
        {!quizEnded && (
          <div className="w-full lg:w-1/4">
            <Leaderboard leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
