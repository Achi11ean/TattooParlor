import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Reviews = ({ artistId }) => {
    
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ star_rating: "", review_text: "", photo_url: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log({ artistId });
  
  // Fetch reviews for the artist
  useEffect(() => {
    if (!artistId) {
        setError("Artist ID is missing or invalid.");
        setLoading(false);
        return;
      }
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5002/api/artists/${artistId}/reviews`);
        setReviews(response.data.reviews || []); // Handle case where reviews are not provided
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [artistId]);

  // Handle new review submission
  const handleCreateReview = async (e) => {
    e.preventDefault();

    if (newReview.star_rating < 1 || newReview.star_rating > 5) {
      alert("Star rating must be between 1 and 5.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      const response = await axios.post(
        `http://127.0.0.1:5002/api/artists/${artistId}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews((prev) => [...prev, response.data]); // Add the new review to the list
      setNewReview({ star_rating: "", review_text: "", photo_url: "" }); // Reset the form
      alert("Review added successfully!");
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add the review.");
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:5002/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((review) => review.id !== reviewId)); // Remove the deleted review
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete the review.");
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div className="p-6 min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 rounded-3xl">
<h1 className="text-3xl font-bold mb-6">Reviews for Artist</h1>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-purple-900 via-blue-800 to-black shadow-lg rounded-lg p-4 hover:shadow-2xl hover:scale-105 transition duration-300"
              >
              <p className="text-white mb-2">
                <strong>Rating:</strong> {review.star_rating}⭐
              </p>
              <p className="text-white mb-2">{review.review_text || "No text provided"}</p>
              {review.photo_url && (
                <img
                  src={review.photo_url}
                  alt="Review"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
      )}

      {/* New Review Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
        <form onSubmit={handleCreateReview} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Star Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.star_rating}
              onChange={(e) => setNewReview((prev) => ({ ...prev, star_rating: e.target.value }))}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Review Text</label>
            <textarea
              value={newReview.review_text}
              onChange={(e) => setNewReview((prev) => ({ ...prev, review_text: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Photo URL</label>
            <input
              type="url"
              value={newReview.photo_url}
              onChange={(e) => setNewReview((prev) => ({ ...prev, photo_url: e.target.value }))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!newReview.star_rating || !newReview.review_text}
            className={`px-4 py-2 rounded-md ${
              newReview.star_rating && newReview.review_text
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
