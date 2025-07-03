import React, { useState, useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import axios from "../config/axios";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();



  const submitHandler = (e) => {
    e.preventDefault();

    toast.promise(
      axios.post("/api/users/login", { email, password }),
      {
        loading: "Wait a Moment...",
        success: (res) => {
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setEmail("");
          setPassword("");
          navigate("/");
          return "User Successfully Logged in";
        },
        error: (res) => {
          console.error(res);
          return "User Failed To Login";
        },
      }
    );
  };

  const googleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const githubSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 md:p-10 bg-gray-800 rounded-2xl shadow-xl space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
          Welcome Back
        </h2>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition"
            onClick={googleSignup}
          >
            <FcGoogle className="text-xl sm:text-2xl" />
            Login with Google
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 transition rounded-lg"
            onClick={githubSignup}
          >
            <FaGithub className="text-xl sm:text-2xl" />
            Login with GitHub
          </button>
        </div>

        <div className="flex items-center justify-center text-gray-400">
          <span className="border-b border-gray-600 w-1/5"></span>
          <span className="mx-2 text-xs sm:text-sm">or login with email</span>
          <span className="border-b border-gray-600 w-1/5"></span>
        </div>

        {/* Email Login Form */}
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg font-medium text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
