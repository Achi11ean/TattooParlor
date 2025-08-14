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

<div className="flex justify-between bg-white border-black border-2 font-serif items-center mb-6">
        <h1   className="text-6xl  mx-auto font-bold font-playfair text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 drop-shadow-lg"
        >Artists</h1>
        </div>
        {showCreateArtistButton && (userType === "artist" || userType === "admin") && (
          
          <button
            onClick={handleCreateArtist}
            className="px-4 py-2 bg-pink-400  text-white text-3xl rounded-md mx-auto hover:bg-blue-700"
          >
            Create Artist 
          </button>
)}
      

      <div className="grid grid-cols-1 text-3xl md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          // Parse availability_schedule if it's a JSON string
          const schedule =
            typeof artist.availability_schedule === "string"
              ? JSON.parse(artist.availability_schedule)
              : artist.availability_schedule;

          return (
<RandomGradient
  key={artist.id}
  onClick={() => navigate(`/artists/${artist.id}`)}
>
  <div
    onClick={() => navigate(`/artists/${artist.id}`)}
    className="p-1 rounded-lg shadow-lg transition duration-300 text-white custom-scrollbar cursor-pointer"
    style={{ height: "400px", overflowY: "auto" }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(`/artists/${artist.id}`)}
  >
    <div className="relative w-40 h-40 bg-gray-200 flex items-center justify-center rounded border-2 overflow-hidden mx-auto">
      <img
        src={artist.profile_picture || "https://via.placeholder.com/150"}
        alt={artist.name}
        className="w-full h-full object-cover"
      />
      {artist.years_of_experience && (
        <span className="absolute bottom-2 z-10 right-2 bg-white text-black text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow-md border border-gray-300">
          {artist.years_of_experience} yrs
        </span>
      )}
    </div>

    <div className="p-4">
      <h2 className="text-4xl font-semibold text-center border-b-2 mb-2">{artist.name}</h2>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {artist.specialties
          ?.split(",")
          .map((specialty, index) => (
            <span
              key={index}
              className="bg-white text-black px-3 py-1 rounded-full text-sm sm:text-base font-medium shadow"
            >
              {specialty.trim()}
            </span>
          ))}
      </div>

      <div className="flex items-center  justify-center mt-4">
        <p className="text-md text-white flex items-center">
          {artist.average_rating
            ? Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`${
                    index < Math.floor(artist.average_rating)
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))
            : "N/A"}
        </p>
      </div>
    </div>

    {(userType === "admin" || userId === artist.created_by) && (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artists/edit/${artist.id}`);
          }}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 float-right focus:ring-offset-2 mt-4"
        >
          Edit Artist
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteArtist(artist.id);
          }}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all w-30 duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 float-left"
        >
          Delete Artist
        </button>
      </>
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
