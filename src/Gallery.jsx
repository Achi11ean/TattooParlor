import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Gallery = ({ artistId, isArtist, isAdmin }) => {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced query
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { authToken } = useAuth();

  // Fetch gallery photos
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:5002/api/artists/${artistId}/gallery`,
          {
            params: { search: debouncedQuery }, // Pass the search query to the backend
          }
        );
        setPhotos(response.data.photos || []);
      } catch (err) {
        setError("Failed to fetch gallery photos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [artistId, debouncedQuery]); // Trigger fetch when artistId or debouncedQuery changes

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after a delay
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler); // Cleanup the timeout if the user types again
    };
  }, [searchQuery]); // Runs whenever searchQuery changes

  // Upload a new photo
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Image URL is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://127.0.0.1:5002/api/artists/${artistId}/gallery`,
        { image_url: imageUrl, caption },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setPhotos((prev) => [...prev, response.data]);
      setImageUrl("");
      setCaption("");
      setError("");
    } catch (err) {
      setError("Failed to upload photo.");
    } finally {
      setLoading(false);
    }
  };
  const { userType } = useAuth(); // Assume userType is provided by the AuthContext

  // Delete a photo
  const handleDelete = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await axios.delete(`http://127.0.0.1:5002/api/gallery/${photoId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token for authentication
        },
      });
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (err) {
      setError("Failed to delete photo.");
    }
  };

  return (
    <div className="gallery-container">
      <h2 className="text-2xl font-bold text-center mb-4">Gallery</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center">Loading...</p>}

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by caption"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
      />

      {/* Horizontal Scrollable Container */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-custom">
  {photos.length > 0 ? (
    photos.map((photo) => (
      <div key={photo.id} className="photo-card flex-shrink-0 relative">
        <img
          src={photo.image_url}
          alt={photo.caption || "Gallery Image"}
          className="w-64 h-64 object-cover rounded-md shadow-md"
        />
        {photo.caption && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-sm p-4 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md">
            {photo.caption}
          </div>
        )}
        {(isArtist || isAdmin) && (
          <button
            aria-label="Delete photo"
            onClick={() => handleDelete(photo.id)}
            className="mt-2 text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center">No photos found.</p>
  )}
</div>


      {/* Upload Form */}
      {(userType === "admin" || userType === "artist") && (
  <form onSubmit={handleUpload} className="upload-form mt-6">
    <h3 className="text-xl font-semibold mb-2">Upload New Photo</h3>
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg rounded-lg max-w-full mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-700">Upload Image</h2>
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border text-white border-gray-300 rounded-lg p-3  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
      />
      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="border border-gray-300 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transform transition-transform duration-200 hover:scale-105"
      >
        Upload
      </button>
    </div>
  </form>
)}

    </div>
  );
};

export default Gallery;
