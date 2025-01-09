/* eslint-disable react/prop-types */
import moment from "moment";
import { FaBook } from "react-icons/fa";

const QuizCard = ({ quiz }) => {
  return (
    <div
      key={quiz._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <FaBook className="text-blue-500 text-2xl mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">{quiz.category} Quiz</h2>
        </div>
        <p className="text-gray-600 mb-0">
          Test your knowledge in {quiz.category.toLowerCase()} with this exciting quiz!
        </p>
        <p className="text-gray-600 mb-4">
          Quiz will start on{" "}
          <strong>
            {quiz?.live_time ? moment(quiz?.live_time).format("dddd, MMMM Do, h:mm a") : ""}
          </strong>
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;