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
    <div className="newsletter-admin-container bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Create a New Newsletter
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="title"
            className="block text-white font-medium mb-1"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the newsletter title"
            className="w-full p-2 rounded-md focus:ring focus:ring-purple-300"
            required
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-white font-medium mb-1"
          >
            Image URL (optional):
          </label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter the image URL"
            className="w-full p-2 rounded-md focus:ring focus:ring-purple-300"
          />
        </div>
        <div>
          <label
            htmlFor="body"
            className="block text-white font-medium mb-1"
          >
            Body:
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter the newsletter content"
            className="w-full p-2 rounded-md h-32 focus:ring focus:ring-purple-300"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-purple-100 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Newsletter"}
        </button>
      </form>
      {message && (
        <p className="text-green-100 text-center mt-4 font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-200 text-center mt-4 font-medium">{error}</p>
      )}
    </div>
  );
};

export default NewsletterAdmin;
