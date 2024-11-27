import React, { useState } from "react";
import axios from "axios";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5002/api/request-password-reset", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      style={{
        backgroundImage: "url('forgot.webp')", // Replace with the actual image URL
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Forgot Password</h2>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {!message && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-white"
            />
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-md"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestPasswordReset;
