import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RandomGradient from "./RandomGradient";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateArtistButton, setShowCreateArtistButton] = useState(() => {
    // Initialize the state from localStorage
    const savedState = localStorage.getItem("showCreateArtistButton");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const [error, setError] = useState(null);
  const { userType, userId } = useAuth();
  const navigate = useNavigate();

  // Function to handle artist deletion
  const handleDeleteArtist = async (artistId) => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is included
        },
      });
      alert("Artist deleted successfully!");

      // Remove the deleted artist from the state
      setArtists((prevArtists) => prevArtists.filter((artist) => artist.id !== artistId));
    } catch (err) {
      console.error("Error deleting artist:", err);
      alert("Failed to delete the artist.");
    }
  };

  // Fetch all artists
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
        const response = await axios.get("https://tattooparlorbackend.onrender.com/api/artists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched artists:", response.data.artists); // Debug the artists data

        setArtists(response.data.artists);
      } catch (err) {
        console.error("Error fetching artists:", err);
        setError("Failed to load artists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);
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
        console.error("Error fetching global setting:", error);
        setError("Failed to load settings.");
      }
    };

    fetchSetting();
  }, []);
  // Navigate to the CreateArtist page
  const handleCreateArtist = () => {
    navigate("/create-artist");
  };

  if (loading) return <div>Loading artists...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div
  className="p-6 min-h-screen"
  style={{
    backgroundImage: "url('/starry.webp')",
    backgroundSize: "cover",
    backgroundBlendMode: "overlay",
  }}
>

<div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-bold">Artists</h1>
        {showCreateArtistButton && (userType === "artist" || userType === "admin") && (
          <button
            onClick={handleCreateArtist}
            className="px-4 py-2 bg-blue-600 text-white text-3xl rounded-md hover:bg-blue-700"
          >
            Create Artist Profile
          </button>
)}
      </div>

      <div className="grid grid-cols-1 text-3xl md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          // Parse availability_schedule if it's a JSON string
          const schedule =
            typeof artist.availability_schedule === "string"
              ? JSON.parse(artist.availability_schedule)
              : artist.availability_schedule;

          return (
<RandomGradient key={artist.id}>
<div className="p-4 rounded-lg shadow-lg transition duration-300 text-white custom-scrollbar"
    style={{
      height: "400px", // Set a fixed height for all cards
      overflowY: "auto", // Add vertical scrolling for overflowing content
    }}>
<div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden mx-auto">
<img
    src={artist.profile_picture || "https://via.placeholder.com/150"}
    alt={artist.name}
    className="w-full h-full object-cover"
  />
</div>



              <div className="p-4">
                <h2 className="text-4xl font-semibold mb-2">{artist.name}</h2>
                <p className="text-white text-xl mb-2">Specialties: {artist.specialties}</p>
                <p className="text-white text-xl mb-4">Bio: {artist.bio}</p>



<p className="text-white text-lg">

<p className="text-white text-xl">
                  <strong>Location:</strong> {artist.location || "N/A"}
                </p>
                  <strong>Years of Experience:</strong>{" "}
                  {artist.years_of_experience || "N/A"}
                </p>
<div className="overflow-x-auto overflow-y-hidden  h-39 mt-2">
  <div className="grid grid-flow-col auto-cols-max gap-3">
    {schedule ? (
      Object.entries(schedule).map(([day, { start, end }]) => (
        <div
          key={day}
          className={`flex flex-col items-center text-center justify-center border rounded-lg p-5 text-base transition-transform transform hover:scale-110 hover:font-bold ${
            start && end ? "bg-pink-500 text-white" : "bg-red-800 text-gray-300"
          }`}
        >
          <span className="font-bold">{day}</span>
          <span>{start && end ? `${start} - ${end}` : "N/A"}</span>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-base col-span-full text-center">
        Not specified
      </p>
    )}
  </div>
</div>




                <div className="flex items-center justify-between mt-4">
                <p className="text-md text-white flex items-center">
  <strong className="mr-2">Rating:</strong>
  {artist.average_rating
    ? Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`${
            index < Math.floor(artist.average_rating) ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          ★
        </span>
      ))
    : "N/A"}
</p>

<button
  onClick={() => navigate(`/artists/${artist.id}`)}
  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
>
  View Profile
</button>

                </div>
                
                {(userType === "admin" || userId === artist.created_by) && (
  <button
    onClick={() => navigate(`/artists/edit/${artist.id}`)}
    className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 float-right focus:ring-offset-2 mt-4"
  >
    Edit Artist
  </button>
)}
              </div>
              {(userType === "admin" || userId === artist.created_by) && (
  <button
    onClick={() => handleDeleteArtist(artist.id)}
    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all  w-30 duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 float-left"
    >
    Delete Artist
  </button>
)}

              </div>
</RandomGradient>
          );
        })}
      </div>
    </div>
  );
};

export default Artists;
