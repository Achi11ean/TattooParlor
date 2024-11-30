import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import CreateArtist from "./CreateArtist"; // Import the new component

const ArtistDashboard = () => {
  const { userType } = useAuth();
  const [artistDetails, setArtistDetails] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [portfolioPreview, setPortfolioPreview] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("https://tattooparlorbackend.onrender.com/api/artist-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const {
        artist_details,
        upcoming_bookings,
        recent_reviews,
        portfolio_preview,
        performance_metrics,
      } = response.data;

      setArtistDetails(artist_details);
      setUpcomingBookings(upcoming_bookings);
      setRecentReviews(recent_reviews);
      setPortfolioPreview(portfolio_preview);
      setPerformanceMetrics(performance_metrics);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    if (userType === "artist") {
      fetchDashboardData();
    }
  }, [userType]);

  if (userType !== "artist") {
    return (
      <div className="text-center text-red-500 text-xl">
        Access denied. Artists only.
      </div>
    );
  }

  return (
    
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Artist Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Render the CreateArtist component */}


      {/* Other sections */}
    </div>
  );
};

export default ArtistDashboard;
