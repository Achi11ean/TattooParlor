import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ArtistDashboard = () => {
  const { userType } = useAuth();
  const navigate = useNavigate();

  const [artistProfile, setArtistProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    styles: [],
    years_of_experience: "",
    social_media: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Artist Profile
  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        if (userType !== "artist") {
          navigate("/signin");
          return;
        }

        const { data } = await axios.get(
          "http://127.0.0.1:5002/api/artist-dashboard/profile",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }
        );

        setArtistProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          specialties: data.specialties || "",
          styles: data.styles || [],
          years_of_experience: data.years_of_experience || "",
          social_media: data.social_media || {},
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching artist profile:", err);
        setError("Failed to fetch artist profile.");
        setLoading(false);
      }
    };

    fetchArtistProfile();
  }, [userType, navigate]);

  // Navigate to CreateArtist Page
  const handleCreateArtist = () => {
    navigate("/create-artist");
  };

  // Update Artist Profile
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        "http://127.0.0.1:5002/api/artist-dashboard/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      setArtistProfile(data.artist);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating artist profile:", err);
      setError("Failed to update artist profile.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Artist Dashboard</h1>

      {/* Add New Artist Button */}
      <div className="mb-6">
        <button
          onClick={handleCreateArtist}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Artist
        </button>
      </div>

      {/* Artist Profile Form */}
      {artistProfile && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Specialties</label>
              <input
                type="text"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Styles</label>
              <input
                type="text"
                value={formData.styles.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    styles: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                value={formData.years_of_experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    years_of_experience: parseInt(e.target.value, 10) || "",
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Artist Details */}
      {artistProfile && (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <p>
            <strong>Name:</strong> {artistProfile.name}
          </p>
          <p>
            <strong>Bio:</strong> {artistProfile.bio}
          </p>
          <p>
            <strong>Specialties:</strong> {artistProfile.specialties}
          </p>
          <p>
            <strong>Styles:</strong> {artistProfile.styles.join(", ")}
          </p>
          <p>
            <strong>Years of Experience:</strong> {artistProfile.years_of_experience}
          </p>
          <p>
            <strong>Social Media:</strong>{" "}
            {Object.entries(artistProfile.social_media).map(([key, value]) => (
              <span key={key}>
                {key}: {value}{" "}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
