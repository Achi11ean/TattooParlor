import React, { useState } from "react";
import axios from "axios";

const Unsubscribe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      setMessage("Please enter an email address.");
      return;
    }

    try {
      const response = await axios.delete(`https://tattooparlorbackend.onrender.com/api/unsubscribe`, {
        params: { email },
      });
      setMessage(response.data.message);
      setEmail(""); // Clear the input field
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-red-300 shadow-md rounded-lg">
      <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Unsubscribe from our Newsletter
      </h4>
      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-red-300 text-gray-700"
        />
        <button
          onClick={handleUnsubscribe}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Unsubscribe
        </button>
      </div>
      {message && (
        <p
          className={`mt-4 text-center font-medium p-3 rounded-lg ${
            message.includes("error")
              ? "bg-red-100 text-red-600 border border-red-300"
              : "bg-green-100 text-green-600 border border-green-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Unsubscribe;
