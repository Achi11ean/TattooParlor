import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userType } = useAuth();
  const navigate = useNavigate();

  // Function to handle artist deletion
  const handleDeleteArtist = async (artistId) => {
    try {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      await axios.delete(`http://127.0.0.1:5002/api/artists/${artistId}`, {
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
        const response = await axios.get("http://127.0.0.1:5002/api/artists", {
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

  // Navigate to the CreateArtist page
  const handleCreateArtist = () => {
    navigate("/create-artist");
  };

  if (loading) return <div>Loading artists...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Artists</h1>
        {userType === "artist" || userType === "admin" ? (
          <button
            onClick={handleCreateArtist}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Artist Profile
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          // Parse availability_schedule if it's a JSON string
          const schedule =
            typeof artist.availability_schedule === "string"
              ? JSON.parse(artist.availability_schedule)
              : artist.availability_schedule;

          return (
            <div
              key={artist.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300"
            >
              <img
                src={artist.profile_picture || "https://via.placeholder.com/150"}
                alt={artist.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
                <p className="text-gray-600 mb-2">{artist.specialties}</p>
                <p className="text-gray-500 text-sm mb-4">{artist.bio}</p>
                <p className="text-gray-700 text-sm">
                  <strong>Location:</strong> {artist.location || "N/A"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Years of Experience:</strong>{" "}
                  {artist.years_of_experience || "N/A"}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Schedule:</strong>{" "}
                  {schedule
                    ? Object.entries(schedule)
                        .map(([day, { start, end }]) =>
                          start && end
                            ? `${day}: ${start} - ${end}`
                            : `${day}: Not available`
                        )
                        .join(" | ")
                    : "Not specified"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    <strong>Rating:</strong>{" "}
                    {artist.average_rating
                      ? artist.average_rating.toFixed(1)
                      : "N/A"}⭐
                  </p>
                  <button
                    onClick={() => navigate(`/artists/${artist.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </button>
                </div>
                {userType === "admin" || userType === "artist" ? (
                  <button
                    onClick={() => handleDeleteArtist(artist.id)}
                    className="mt-4 px-4  py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
                  >
                    Delete Artist
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Artists;
