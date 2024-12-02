import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the useAuth hook

const Subscribers = () => {
  const { authToken, userType } = useAuth(); // Get authToken and userType from context
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchSubscribers = async (page = 1, searchQuery = "") => {
    try {
      const response = await axios.get("https://tattooparlorbackend.onrender.com/api/subscribers", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, per_page: 10, search: searchQuery }, // Pass the search query
      });
      setSubscribers(response.data.subscribers || []);
      setTotalPages(response.data.total_pages || 1);
      setCurrentPage(response.data.current_page || 1);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSubscribers();
  }, [authToken]); // Fetch data when authToken changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSubscribers(1, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchSubscribers(newPage, search);
    }
  };

  return (
    <div className="subscribers-container bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Subscribers</h1>
      {userType !== "admin" && (
        <p className="text-red-500 text-center">Access restricted to admin users.</p>
      )}
      {userType === "admin" && (
        <>
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscribers..."
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
          ) : subscribers && Array.isArray(subscribers) && subscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Subscribed On</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6">{subscriber.id}</td>
                      <td className="py-3 px-6">{subscriber.email}</td>
                      <td className="py-3 px-6">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No subscribers found.</p>
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
        </>
      )}
    </div>
  );
};

export default Subscribers;
