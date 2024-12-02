import React, { useState } from "react";
import axios from "axios";

const NewsletterAdmin = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("https://tattooparlorbackend.onrender.com/api/newsletters", {
        title,
        image,
        body,
      });
      setMessage(response.data.message);
      setTitle("");
      setImage("");
      setBody("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-admin-container bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 rounded-3xl shadow-2xl max-w-3xl mx-auto transform transition duration-300 hover:scale-105">
      <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-wide drop-shadow-lg">
        ✨ Create Your Newsletter ✨
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="relative">
          <label
            htmlFor="title"
            className="block text-white text-xl font-semibold mb-3"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the newsletter title"
            className="w-full p-4 text-gray-800 rounded-lg shadow-inner focus:ring-4 focus:ring-pink-400 focus:outline-none transition transform hover:scale-105"
            required
          />
          <span className="absolute top-full left-0 mt-1 text-sm text-gray-300 italic">
            Make it catchy!
          </span>
        </div>
        <div className="relative">
          <label
            htmlFor="image"
            className="block text-white text-xl font-semibold mb-3"
          >
            Image URL (optional):
          </label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter the image URL"
            className="w-full p-4 text-gray-800 rounded-lg shadow-inner focus:ring-4 focus:ring-pink-400 focus:outline-none transition transform hover:scale-105"
          />
          <span className="absolute top-full left-0 mt-1 text-sm text-gray-300 italic">
            Add a link to an eye-catching image!
          </span>
        </div>
        <div className="relative">
          <label
            htmlFor="body"
            className="block text-white text-xl font-semibold mb-3"
          >
            Body:
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter the newsletter content"
            className="w-full p-4 text-gray-800 rounded-lg shadow-inner h-48 resize-none focus:ring-4 focus:ring-pink-400 focus:outline-none transition transform hover:scale-105"
            required
          ></textarea>
          <span className="absolute top-full left-0 mt-1 text-sm text-gray-300 italic">
            Share your latest updates here!
          </span>
        </div>
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:from-pink-400 hover:to-indigo-400 transition duration-300 transform hover:scale-110 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "🚀 Send Newsletter"}
        </button>
      </form>
      {message && (
        <p className="text-green-100 text-center mt-6 font-semibold bg-green-600 p-4 rounded-lg shadow-lg">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-100 text-center mt-6 font-semibold bg-red-600 p-4 rounded-lg shadow-lg">
          {error}
        </p>
      )}
    </div>
  );
  
  
};

export default NewsletterAdmin;
