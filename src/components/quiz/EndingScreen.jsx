/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect } from "react";
import { FaTrophy } from "react-icons/fa";
import { useParams } from "react-router-dom";

const EndingScreen = ({ leaderboard }) => {
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  const { quizId } = useParams();

  useEffect(() => {
    async function submitQuiz() {
      try {
        const res = await axios.post(`/api/v1/quiz/${quizId}`);
        console.log(res);
      } catch (error) {
        console.log("Quiz submission failed", error);
      }
    }
    submitQuiz();
  }, [quizId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Completed!</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
          <FaTrophy className="mr-2 text-yellow-500" />
          Final Leaderboard
        </h3>
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
      <div className="text-center">
        <p className="text-lg font-medium">Thank you for participating!</p>
      </div>
    </div>
  );
};

export default EndingScreen;
