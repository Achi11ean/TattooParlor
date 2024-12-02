import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsletterPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null); // For modal

  const fetchNewsletters = async (page = 1, searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://tattooparlorbackend.onrender.com/api/newsletters", {
        params: { page, per_page: 5, search: searchQuery },
      });
      setNewsletters(response.data.newsletters);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNewsletters(1, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNewsletters(newPage, search);
    }
  };

  const handleCardClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
  };

  const closeModal = () => {
    setSelectedNewsletter(null);
  };

  return (
<div
  className="newsletter-page-container bg-yellow-200 p-6 mx-auto"
  style={{
    backgroundImage: `url(geometric.webp)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
      <h1 className="text-3xl font-bold text-center text-black mb-6">Newsletters</h1>
      <form onSubmit={handleSearch} className="flex items-center  gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded-lg flex-grow focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : Array.isArray(newsletters) && newsletters.length > 0 ? (
        <div className="newsletter-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-fit gap-4">
          {newsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className="newsletter-card bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
              onClick={() => handleCardClick(newsletter)}
            >
              <h2 className="text-lg font-bold mb-2">{newsletter.title}</h2>
              {newsletter.image && (
                <img
                  src={newsletter.image}
                  alt={newsletter.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <p className="text-sm text-gray-600">
                {newsletter.body.slice(0, 50)}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No newsletters found.</p>
      )}
      <div className="pagination flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for expanded view */}
      {selectedNewsletter && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {selectedNewsletter.title}
            </h2>
            {selectedNewsletter.image && (
              <img
                src={selectedNewsletter.image}
                alt={selectedNewsletter.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700">{selectedNewsletter.body}</p>
            <p className="text-sm text-gray-500 mt-4">
              Published on {selectedNewsletter.created_at}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;
