/* eslint-disable react/prop-types */
import { FaTrophy } from "react-icons/fa";

const EndingScreen = ({ leaderboard }) => {
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

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
