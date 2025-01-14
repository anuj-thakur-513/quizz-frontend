/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { EMAIL_REGEX } from "../../constants";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = ({ setIsLogin }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setIsEmailValid(false);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/login", { email, password });
      if (res.data?.data) {
        window.localStorage.setItem("user", JSON.stringify(res.data.data));
        window.location.href = "/home";
      }
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <p
          className="mt-2 underline text-sm text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(false)}
        >
          Don&apos;t have an account? Register Now
        </p>
      </div>
    </div>
  );
};

export default Login;
