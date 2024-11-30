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
  const [showCreateArtistButton, setShowCreateArtistButton] = useState(false);

  const [editingUser, setEditingUser] = useState(null); // Track user being edited
  const [editedData, setEditedData] = useState({}); // Store changes
  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setEditingUser(userId);
    setEditedData({ username: user.username, email: user.email, user_type: user.user_type });
  };

  const handleSaveUser = async () => {
    try {
      const response = await axios.patch(
        `https://tattooparlorbackend.onrender.com/api/users/${editingUser}`,
        editedData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      if (response.status === 200) {
        alert("User updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editingUser ? response.data.user : user))
        );
        setEditingUser(null); // Exit editing mode
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`https://tattooparlorbackend.onrender.com/api/users/${userId}`, {
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
        `https://tattooparlorbackend.onrender.com/api/bookings/${bookingId}/payment_status`,
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
  const handleCancelEdit = () => {
    setEditingUser(null); // Cancel editing
    setEditedData({});
  };

  // Fetch the button state from the backend
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await axios.get(
          "https://tattooparlorbackend.onrender.com/api/global-settings/show_create_artist_button",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
            },
          }
        );
        setShowCreateArtistButton(response.data.show_create_artist_button);
      } catch (error) {
        console.error("Error fetching setting:", error);
      }
    };
  
    fetchSetting();
  }, []);

  const toggleShowCreateArtistButton = async () => {
    try {
      const response = await axios.patch(
        "https://tattooparlorbackend.onrender.com/api/global-settings/show_create_artist_button",
        { value: !showCreateArtistButton }, // Toggle the current value
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
          },
        }
      );
  
      setShowCreateArtistButton(response.data.show_create_artist_button); // Update UI with the response
    } catch (error) {
      console.error("Error updating setting:", error);
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
          axios.get("https://tattooparlorbackend.onrender.com/api/admin-dashboard", {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          axios.get("https://tattooparlorbackend.onrender.com/api/admin-dashboard/bookings-trends", {
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
    backgroundImage: `url('admin.webp')`, // Replace with your image URL or route
    backgroundSize: "cover", // Ensure the image covers the entire container
    backgroundPosition: "center", // Center the image
    backgroundRepeat: "no-repeat", // Prevent the image from repeating
    color: "#fff", // White text for better readability
  }}
>

<h1
  className="text-5xl  mt-0 font-extrabold mb-8 text-center text-black bg-white"
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
  Admin Dashboard
</h1>

<div className="flex justify-end items-center mb-4">
  <button
    onClick={toggleShowCreateArtistButton}
    className={`px-4 py-2 text-white rounded-md shadow-lg ${
      showCreateArtistButton ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
    } transition-all`}
  >
    {showCreateArtistButton ? "Hide Create Artist Button" : "Show Create Artist Button"}
  </button>
</div>
{/* Platform Metrics */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 px-4">
  {/* Total Bookings */}
  <div className="bg-white shadow-md rounded-lg p-6 text-center transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300 max-w-[250px] mx-auto">
    <h2 className="text-xl font-medium text-gray-700">Total Bookings</h2>
    <p className="text-5xl font-bold text-blue-600 mt-3">
      {platformMetrics.total_bookings || 0}
    </p>
    <span className="block mt-2 text-sm text-gray-500">Bookings so far</span>
  </div>

  {/* Total Earnings */}
  <div className="bg-white shadow-md rounded-lg p-6 pr-20 text-center transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300 max-w-[250px] mx-auto">
    <h2 className="text-xl font-medium text-gray-700">Total Earnings</h2>
    <p className="text-4xl font-bold text-green-600 mt-3">
      ${platformMetrics.total_earnings?.toFixed(2) || "0.00"}
    </p>
    <span className="block mt-2 text-sm text-gray-500">Earnings to date</span>
  </div>

  {/* Average Rating */}
  <div className="bg-white shadow-md rounded-lg p-6 text-center transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300 max-w-[250px] mx-auto">
    <h2 className="text-xl font-medium text-gray-700">Average Rating</h2>
    <p className="text-5xl font-bold text-yellow-500 mt-3">
      {platformMetrics.average_rating || "N/A"}
    </p>
    <span className="block mt-2 text-sm text-gray-500">Overall rating</span>
  </div>
</div>



<div className=" shadow-lg rounded-lg p-6 mb-6" style={{ maxHeight: "400px", overflow: "hidden" }}>
  {/* Title with gradient background */}


{/* Chart Container */}
{/* Chart Container */}
<div 
  className="p-2  shadow-lg rounded-lg flex flex-col justify-center items-center" 
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
<div className=" shadow-md rounded-lg ml-20 p-6 mb-6"
  style={{ maxWidth: "1800px" }} // Limit the width of the container
>
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
        selector: (row) =>
          editingUser === row.id ? (
            <input
              type="text"
              value={editedData.username}
              onChange={(e) =>
                setEditedData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="p-1 border rounded"
            />
          ) : (
            row.username
          ),
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) =>
          editingUser === row.id ? (
            <input
              type="email"
              value={editedData.email}
              onChange={(e) =>
                setEditedData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="p-1 border rounded"
            />
          ) : (
            row.email
          ),
      },
      {
        name: "User Type",
        selector: (row) =>
          editingUser === row.id ? (
            <select
              value={editedData.user_type}
              onChange={(e) =>
                setEditedData((prev) => ({ ...prev, user_type: e.target.value }))
              }
              className="p-1 border rounded"
            >
              <option value="admin">Admin</option>
              <option value="artist">Artist</option>
            </select>
          ) : (
            row.user_type
          ),
      },
      {
        name: "Created At",
        selector: (row) => row.created_at || "N/A",
        sortable: true, // Allow sorting by created_at
      },
      {
        name: "Last Login",
        selector: (row) => row.last_login || "Never",
      },
      {
        name: "Actions",
        cell: (row) =>
          editingUser === row.id ? (
            <div>
              <button
                onClick={handleSaveUser}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded shadow"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => handleEditUser(row.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(row.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
              >
                Delete
              </button>
            </div>
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




    </div>
  );
};

export default AdminDashboard;
