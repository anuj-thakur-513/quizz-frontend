/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { EMAIL_REGEX } from "../../constants";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Signup = ({ setIsLogin }) => {
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = emailRef.current?.value;
    const name = nameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!email || !name || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setIsEmailValid(false);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/signup", { email, password, name });
      if (res.data?.data) {
        window.localStorage.setItem("user", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.log(err);
      setError("Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              placeholder="Email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEmailValid ? "border-gray-300" : "border-red-500"
              }`}
              onChange={() => setIsEmailValid(true)}
            />
            {!isEmailValid && (
              <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
            )}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              ref={passwordRef}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-8 text-gray-500 focus:outline-none"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              ref={confirmPasswordRef}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              className="absolute right-3 top-8 text-gray-500 focus:outline-none"
            >
              {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p
          className="mt-2 underline text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(true)}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Signup;
