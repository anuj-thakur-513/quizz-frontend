import axios from "axios";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import QuizCard from "../components/quiz/QuizCard";

const Home = () => {
  const [quizzes, setQuizzes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        setLoading(true);
        const response = await axios.get("/api/v1/quiz/");
        if (response.data?.data) {
          setQuizzes(response.data.data);
        }
      } catch (error) {
        console.log(error);
        setError("Failed to fetch quizzes. Please try again later.");
        setQuizzes(null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Welcome to Quizz</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex">
            <div className="py-1">
              <FaExclamationTriangle className="text-red-500 mr-4" />
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      ) : quizzes && quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-xl">No Quizzes Found</p>
          <p className="mt-2">Check back later for new quizzes!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
