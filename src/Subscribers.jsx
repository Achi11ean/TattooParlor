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
    setLoading(true);
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

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete the subscriber: ${email}?`)) {
      return;
    }
    try {
      await axios.delete("https://tattooparlorbackend.onrender.com/api/unsubscribe", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { email },
      });
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber.email !== email)
      );
      alert("Subscriber deleted successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete subscriber.");
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
    <div className="subscribers-container bg-gradient-to-b from-blue-500 to-indigo-500 p-8 rounded-xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">
        Subscribers
      </h1>
      {userType !== "admin" && (
        <p className="text-red-200 text-center bg-red-500 p-4 rounded-lg shadow-md">
          Access restricted to admin users.
        </p>
      )}
      {userType === "admin" && (
        <>
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-4 mb-8"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscribers..."
              className="p-3 border border-gray-300 rounded-full flex-grow focus:ring focus:ring-indigo-300"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition font-semibold"
            >
              Search
            </button>
          </form>
          {loading ? (
            <p className="text-center text-white text-lg animate-pulse">
              Loading...
            </p>
          ) : error ? (
            <p className="text-center text-red-200 bg-red-500 p-4 rounded-lg shadow-md">
              {error}
            </p>
          ) : subscribers && Array.isArray(subscribers) && subscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-indigo-600 text-white uppercase text-sm font-semibold">
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Subscribed On</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="py-4 px-6">{subscriber.id}</td>
                      <td className="py-4 px-6">{subscriber.email}</td>
                      <td className="py-4 px-6">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDelete(subscriber.email)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-white text-lg">
              No subscribers found.
            </p>
          )}
          <div className="pagination flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-300 transition disabled:opacity-50 font-medium"
            >
              Previous
            </button>
            <span className="text-white font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-300 transition disabled:opacity-50 font-medium"
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
