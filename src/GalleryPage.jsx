import React, { useState, useEffect } from "react";
import axios from "axios";

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // State for the modal

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await axios.get(`https://tattooparlorbackend.onrender.com/api/galleries?page=${page}`);
        setGalleries(response.data.galleries);
        setTotalPages(response.data.pages);
      } catch (err) {
        setError("Failed to load galleries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) return <div className="text-center mt-20 text-2xl">Loading galleries...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-red-900 to-black min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
        Gallery
      </h1>
      <div className="mt-4 flex justify-center">
          <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="100"
            style={{ width: "100%", maxWidth: "600px", borderRadius: "10px" }}
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/us/album/calm-piano-playlist/1473136325" // Replace with your Apple Music embed URL
          ></iframe>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onClick={() => openModal(gallery)} // Open modal on click
          >
            <img
              src={gallery.image_url}
              alt={gallery.caption || "Gallery Image"}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-500">
              <p className="text-white text-lg px-4 text-center">
                {gallery.caption || "No caption provided"}
              </p>
              <p className="text-gray-300 text-sm mt-2">By: {gallery.artist_name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:scale-105 transform transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xl font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:scale-105 transform transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 left-4 text-red-400 hover:text-gray-900 text-5xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || "Gallery Image"}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-gray-800 text-lg">
                {selectedImage.caption || "No caption provided"}
              </p>
              <p className="text-gray-500 text-sm">By: {selectedImage.artist_name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
