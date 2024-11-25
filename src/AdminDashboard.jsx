import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import DataTable from "react-data-table-component";
import "tailwindcss/tailwind.css";

ChartJS.register(...registerables);

const AdminDashboard = () => {
  const { userType } = useAuth();
  const navigate = useNavigate();
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`http://127.0.0.1:5002/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
  
      if (response.status === 200) {
        alert("User deleted successfully");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };
  
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [platformMetrics, setPlatformMetrics] = useState({});
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handlePaymentStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5002/api/bookings/${bookingId}/payment_status`,
        { payment_status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      // Update the bookings data to reflect the change
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, payment_status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (userType !== "admin") {
        navigate("/signin");
        return;
      }

      try {
        const [dashboardResponse, trendsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:5002/api/admin-dashboard", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          axios.get("http://127.0.0.1:5002/api/admin-dashboard/bookings-trends", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
        ]);

        setUsers(dashboardResponse.data.users || []);
        setBookings(dashboardResponse.data.bookings || []);
        setPlatformMetrics(dashboardResponse.data.platform_metrics || {});
        setMonthlyTrends(trendsResponse.data.monthly_trends || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response || err.message);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userType, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Chart data for monthly trends
  const chartData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Monthly Bookings",
        data: [10, 15, 7, 12, 20],
        borderColor: "#6a11cb",
        backgroundColor: "rgba(106, 17, 203, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "#ff6bcb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4, // Smooth line
      },
    ],
  };
  
  // Columns for user table
  const userColumns = [
    { name: "Username", selector: (row) => row.username, sortable: true },
    { name: "User Type", selector: (row) => row.user_type, sortable: true },
    { name: "Last Login", selector: (row) => row.last_login || "Never", sortable: true },
  ];

  // Columns for bookings table
  const bookingColumns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Artist", selector: (row) => row.artist_name || "No artist", sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
  ];

  return (
<div
  className="h-screen overflow-y-auto"
  style={{
    background: "linear-gradient(to bottom, #1e3a8a, #1e40af, #1e429f, #1e3a8a, #000)", // Blue gradient to black
    color: "#fff", // White text for better readability
  }}
>

 <h1 className="text-3xl mt-10 font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3  gap-6 mb-6">
  {/* Total Bookings */}
  <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
    <h2 className="text-lg font-semibold">Total Bookings</h2>
    <p className="text-4xl font-extrabold mt-2">
      {platformMetrics.total_bookings || 0}
    </p>
    <span className="block mt-1 text-sm opacity-75">Bookings so far</span>
  </div>

  {/* Total Earnings */}
  <div className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
    <h2 className="text-lg font-semibold">Total Earnings</h2>
    <p className="text-4xl font-extrabold mt-2">
      ${platformMetrics.total_earnings?.toFixed(2) || "0.00"}
    </p>
    <span className="block mt-1 text-sm opacity-75">Earnings to date</span>
  </div>

  {/* Average Rating */}
  <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
    <h2 className="text-lg font-semibold">Average Rating</h2>
    <p className="text-4xl font-extrabold mt-2">
      {platformMetrics.average_rating || "N/A"}
    </p>
    <span className="block mt-1 text-sm opacity-75">Overall rating</span>
  </div>
</div>


<div className=" shadow-lg rounded-lg p-6 mb-6" style={{ maxHeight: "400px", overflow: "hidden" }}>
  {/* Title with gradient background */}


{/* Chart Container */}
{/* Chart Container */}
<div 
  className="p-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-lg flex flex-col justify-center items-center" 
  style={{ minHeight: "450px", maxWidth: "95%", margin: "0 auto" }} // Increased minHeight for more space
>
  <h2 
    className="text-2xl font-bold text-white mb-4 text-center"
    style={{ width: "100%", textAlign: "center" }} // Center-align title with full width
  >
    Monthly Booking Trends
  </h2>
  <div 
    className="bg-white rounded-lg p-4 shadow-md w-full" 
    style={{ maxWidth: "1200px", height: "250px", paddingBottom: "20px", marginBottom: "60px" }} // Increased height and added paddingBottom
  >
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "#000",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#ccc",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#555",
              font: { weight: "bold" },
            },
            grid: {
              color: "#eaeaea",
            },
          },
          x: {
            ticks: {
              color: "#555",
              font: { weight: "bold" },
            },
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  </div>
</div>


</div>



{/* Users Table */}
<div className="bg-gradient-to-r from-red-400 via-yellow-500 to-purple-300 shadow-md rounded-lg p-6 mb-6">
  <h2
    className="text-2xl font-bold mb-4 text-center"
    style={{
      background: "linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Users
  </h2>
  <DataTable
    columns={[
      {
        name: "Username",
        selector: (row) => row.username,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
      },
      {
        name: "User Type",
        selector: (row) => row.user_type,
      },
      {
        name: "Last Login",
        selector: (row) => row.last_login || "Never",
      },
      {
        name: "Actions",
        cell: (row) => (
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
          >
            Delete
          </button>
        ),
      },
    ]}
    data={users}
    pagination
    highlightOnHover
    pointerOnHover
    responsive
    customStyles={{
      headCells: {
        style: {
          backgroundColor: "pink",
          color: "#0369A1",
          fontWeight: "bold",
          fontSize: "16px",
          borderBottom: "1px solid #93C5FD",
        },
      },
      rows: {
        style: {
          backgroundColor: "#FFFFFF",
          "&:nth-child(even)": {
            backgroundColor: "#F1F5F9",
          },
          "&:hover": {
            backgroundColor: "#E0F2FE",
          },
        },
      },
      pagination: {
        style: {
          backgroundColor: "lightblue",
          color: "#0369A1",
        },
        pageButtonsStyle: {
          borderRadius: "5px",
          color: "#0369A1",
          "&:hover": {
            backgroundColor: "#93C5FD",
            color: "black",
          },
        },
      },
    }}
  />
</div>



      {/* Bookings Table */}
      <div
  className="shadow-lg rounded-lg p-6"
  style={{
    background: "linear-gradient(to bottom right, #4f46e5, #8b5cf6, #ec4899)",
    color: "#fff",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Enhanced shadow for a lifting effect
    border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border for depth
  }}
>
  <h2 className="text-xl font-semibold mb-4">Bookings</h2>
  <DataTable
    columns={[
      ...bookingColumns,
      {
        name: "Payment Status",
        selector: (row) => row.payment_status,
        cell: (row) => (
          <select
            value={row.payment_status}
            onChange={(e) => handlePaymentStatusUpdate(row.id, e.target.value)}
            className="p-1 rounded bg-white text-black border border-gray-300"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        ),
        sortable: true,
      },
    ]}
    data={bookings}
    pagination
    highlightOnHover
    pointerOnHover
    responsive
  />
</div>

    </div>
  );
};

export default AdminDashboard;
