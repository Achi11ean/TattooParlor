import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the AuthContext hook

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Allows redirection after successful login

  const { login } = useAuth(); // Access the login function from AuthContext

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Clear any previous errors
      console.log("Submitting login with data:", formData); // Log the form data
      const response = await axios.post("http://127.0.0.1:5002/api/signin", formData, {
        headers: { "Content-Type": "application/json" }, // Ensure content type is explicitly set
      });
      console.log("Sign-in successful:", response.data);

      // Extract token and user details
      const { token, user } = response.data;

      // Call the login function from AuthContext to store token and user info
      login(token, user);

      // Redirect to the desired route
      navigate("/");
    } catch (err) {
      console.error("Error during sign-in:", err);
      if (err.response) {
        setError(err.response.data.error || "Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please check your network and try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('signin.webp')", // Replace with your image URL
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h2 className="text-4xl font-bold text-center text-white">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full bg-gray-800 border border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-3 block w-full bg-gray-800 border border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
          >
            Sign In
          </button>
        </form>
        <div className="text-center">
          <p className="text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Sign up!
            </Link>
          </p>
          <Link to="/forgot-password" className="text-red-500 hover:underline">
  Forgot Password?
</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
