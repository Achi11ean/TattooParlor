import React, { useEffect, useState } from "react";
import axios from "axios";
import FallingStars from "./FallingStars"; // Import the falling stars component
import { useAuth } from "./AuthContext"; // Ensure this is the correct path

const Reviews = ({ artistId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ star_rating: "", review_text: "", photo_url: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStars, setShowStars] = useState(false); // Control the falling stars animation
  const { userType, authToken, userId } = useAuth(); // Add userId if available in AuthContext

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
        const response = await axios.get(`https://tattooparlorbackend.onrender.com/api/artists/${artistId}/reviews`);
        setReviews(response.data.reviews || []);
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
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `https://tattooparlorbackend.onrender.com/api/artists/${artistId}/reviews`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) => [...prev, response.data]);
      setNewReview({ star_rating: "", review_text: "", photo_url: "" });
      setShowStars(true); // Trigger falling stars animation
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add the review.");
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete the review.");
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6  bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 rounded-3xl">
      <h1 className="text-3xl font-bold mb-6">Reviews for Artist</h1>

      {/* Reviews List */}
{/* Reviews List */}
{reviews.length > 0 ? (
  <div className="flex overflow-x-auto mb-5 gap-4 scrollbar-custom">
    {reviews.map((review) => (
      <div
        key={review.id}
        className="flex-shrink-0 relative bg-gradient-to-br from-purple-900 via-blue-800 to-black shadow-lg rounded-lg p-4 hover:shadow-2xl hover:scale-105 transition duration-300 w-64 group"
      >
        <p className="text-white mb-2 flex items-center">
          <strong>Rating:</strong>
          <span className="ml-2">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`text-xl ${
                  index < review.star_rating ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </span>
            ))}
          </span>
        </p>
        <div className="relative">
          {review.photo_url && (
            <img
              src={review.photo_url}
              alt="Review"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
            {review.review_text || "No text provided"}
          </div>
        </div>
        {(userType === "admin" || userId === artistId) && (

        <button
          onClick={() => handleDeleteReview(review.id)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
        )}
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
)}

      {/* New Review Form */}
      <div
        className="shadow-lg bg-black w-full rounded-lg p-6 text-white"
        style={{
          backgroundImage: "url('/reviews.webp')",
          backgroundSize: "contain",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
        <form onSubmit={handleCreateReview} className="space-y-4">
          <div>
            <label className="text-red-700 font-medium">Star Rating</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setNewReview((prev) => ({ ...prev, star_rating: index + 1 }))
                  }
                  className={`text-lg ${
                    index < newReview.star_rating ? "text-yellow-400" : "text-white"
                  }`}
                  style={{ padding: 0, background: "none", border: "none" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white font-medium">Review Text</label>
            <textarea
              value={newReview.review_text}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, review_text: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-white font-medium">Photo URL</label>
            <input
              type="url"
              value={newReview.photo_url}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, photo_url: e.target.value }))
              }
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
      {showStars && <FallingStars onComplete={() => setShowStars(false)} />}
    </div>
  );
};

export default Reviews;
