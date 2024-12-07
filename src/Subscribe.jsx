import React, { useState } from "react";
import axios from "axios";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("https://tattooparlorbackend.onrender.com/api/subscribe", { email });
      setMessage(response.data.message);
      setEmail(""); // Clear the input field after success
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-container bg-gradient-to-r from-pink-500 to-yellow-500 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto">
      <h2 className="text-4xl font-extrabold text-white text-center mb-4">
        Join Our Newsletter
      </h2>
      <p className="text-black text-center text-lg mb-6">
        Get exclusive deals, flash sales, and updates!
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-4 rounded-full text-lg border-none focus:ring focus:ring-yellow-400"
          required
        />
        <button
          type="submit"
          className={`bg-white text-pink-600 font-bold py-2 px-4 rounded-full shadow-md hover:bg-yellow-100 hover:text-pink-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className="text-green-100 text-center mt-3 text-sm font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-200 text-center mt-3 text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Subscribe;
