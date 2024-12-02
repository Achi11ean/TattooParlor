import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Subscribers = () => {
  const { authToken, userType } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    const getMetrics = async () => {
      const data = await fetchMetrics();
      setMetrics(data); // Set the fetched metrics data
    };
  
    getMetrics();
  }, [authToken]); // Ensure it runs when the `authToken` changes
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMetrics = async () => {
    console.log("Fetching metrics...");
    try {
      const response = await axios.get(
        "https://tattooparlorbackend.onrender.com/api/metrics/subscribers",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Metrics response:", response.data);
      return response.data; // Ensure this includes monthly data
    } catch (err) {
      console.error(err.response?.data?.error || "Failed to fetch metrics.");
      return null;
    }
  };
  

  const fetchSubscribers = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await axios.get("https://tattooparlorbackend.onrender.com/api/subscribers", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, per_page: 10, search: searchQuery },
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

  const handleUnsubscribe = async (email) => {
    if (!window.confirm(`Are you sure you want to unsubscribe ${email}?`)) {
      return;
    }
    try {
      await axios.delete("https://tattooparlorbackend.onrender.com/api/unsubscribe", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { email },
      });
      setSubscribers((prevSubscribers) =>
        prevSubscribers.map((subscriber) =>
          subscriber.email === email ? { ...subscriber, is_active: false } : subscriber
        )
      );
      alert("Subscriber unsubscribed successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to unsubscribe.");
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize dynamically
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Make the legend text color white for better contrast
          font: {
            size: 15, // Adjust font size for better readability
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Subscriber Metrics (Last 12 Months)",
        color: "white", // Title text color
        font: {
          size: 18, // Increase title font size
          weight: "bold",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for tooltips
        titleColor: "white", // Tooltip title color
        bodyColor: "white", // Tooltip body text color
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // X-axis tick labels color
          font: {
            size: 12, // Adjust font size
            weight: "bold",
          },
        },
        grid: {
          display: false, // Hide grid lines on the x-axis
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // Y-axis tick labels color
          font: {
            size: 12, // Adjust font size
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Light grid lines for better visibility
        },
      },
    },
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete subscriber ID: ${id}? This action cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/subscribers/${id}/delete`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber.id !== id)
      );
      alert("Subscriber deleted successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete subscriber.");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [authToken]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSubscribers(1, search);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchSubscribers(newPage, search);
    }
  };
  const getLastTwelveMonthsLabels = () => {
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7)); // Use 'YYYY-MM' format
    }
    return months;
  };
  
  
  
  const data = {
    labels: getLastTwelveMonthsLabels(),
    datasets: [
      {
        label: "New Subscribers",
        color: "white",
        data: metrics?.monthly_new_subscribers || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Unsubscribes",
        data: metrics?.monthly_unsubscribes || [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };
  

  console.log("Chart Labels:", getLastTwelveMonthsLabels());
console.log("Monthly New Subscribers:", metrics?.monthly_new_subscribers);
console.log("Monthly Unsubscribes:", metrics?.monthly_unsubscribes);
console.log("Metrics fetched:", metrics);

  return (
    <div className="subscribers-container bg-gradient-to-b from-pink-800 to-indigo-500 p-8 rounded-xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">Subscribers</h1>
      {metrics && (
        <div style={{ maxHeight: "1500px", overflow: "hidden" }}>
  <Line data={data} options={options} />
</div>
)}
      {userType !== "admin" && (
        <p className="text-red-200 text-center bg-red-500 p-4 rounded-lg shadow-md">
          Access restricted to admin users.
        </p>

        
      )}
      {userType === "admin" && (
        <>
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
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
            <p className="text-center text-white text-lg animate-pulse">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-200 bg-red-500 p-4 rounded-lg shadow-md">{error}</p>
          ) : subscribers && Array.isArray(subscribers) && subscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-indigo-600 text-white uppercase text-sm font-semibold">
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Subscribed On</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-indigo-50 transition">
                      <td className="py-4 px-6">{subscriber.id}</td>
                      <td className="py-4 px-6">{subscriber.email}</td>
                      <td className="py-4 px-6">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="py-4 px-6 flex gap-2">
                        {subscriber.is_active ? (
                          <button
                            onClick={() => handleUnsubscribe(subscriber.email)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                          >
                            Unsubscribe
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleDelete(subscriber.id)}
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
            <p className="text-center text-white text-lg">No subscribers found.</p>
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
