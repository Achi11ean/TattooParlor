import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const EditArtist = () => {
  const { id } = useParams(); // Get artist ID from the URL
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    social_media: { facebook: "", instagram: "", twitter: "", linkedin: "" },
    years_of_experience: "",
    styles: "",
    location: "",
    profile_picture: "",
    availability_schedule: {
      Monday: { start: "", end: "" },
      Tuesday: { start: "", end: "" },
      Wednesday: { start: "", end: "" },
      Thursday: { start: "", end: "" },
      Friday: { start: "", end: "" },
      Saturday: { start: "", end: "" },
      Sunday: { start: "", end: "" },
    },
    certifications: "",
    awards: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5002/api/artists/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const artistData = response.data;

        setFormData({
          ...artistData,
          styles: Array.isArray(artistData.styles) ? artistData.styles.join(", ") : "",
          social_media: artistData.social_media || {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
          },
          availability_schedule:
          typeof artistData.availability_schedule === "string"
            ? JSON.parse(artistData.availability_schedule) // Parse if it's a string
            : artistData.availability_schedule || {
                Monday: { start: "", end: "" },
                Tuesday: { start: "", end: "" },
                Wednesday: { start: "", end: "" },
                Thursday: { start: "", end: "" },
                Friday: { start: "", end: "" },
                Saturday: { start: "", end: "" },
                Sunday: { start: "", end: "" },
              },
        });
      } catch (err) {
        console.error("Error fetching artist:", err);
        setError("Failed to load artist data.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id, authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social_media.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social_media: { ...prev.social_media, [field]: value },
      }));
    } else if (name === "is_active") {
      setFormData((prev) => ({
        ...prev,
        is_active: value === "true",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleStylesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      styles: e.target.value,
    }));
  };

  const handleScheduleChange = (day, type, value) => {
    setFormData((prev) => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: { ...prev.availability_schedule[day], [type]: value },
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Ensure `availability_schedule` is properly formatted
      const payload = {
        ...formData,
        years_of_experience: parseInt(formData.years_of_experience, 10), // Explicitly convert to integer
        styles: formData.styles.split(",").map((style) => style.trim()), // Convert styles to an array
        availability_schedule: { ...formData.availability_schedule }, // Ensure it's an object
      };
  
      console.log("Submitting payload:", payload); // Debugging to verify format
  
      // Make the PATCH request
      const response = await axios.patch(
        `http://127.0.0.1:5002/api/artists/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      console.log("Patch response:", response.data); // Debugging response
      alert("Artist updated successfully!");
      navigate("/artists");
    } catch (err) {
      console.error("Error updating artist:", err);
      setError(err.response?.data?.error || "Something went wrong!");
    }
  };
  
  
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 24;
    const period = hour < 12 ? "AM" : "PM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:00 ${period}`;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div
  className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/profile2.webp')", // Replace with your image path
    backgroundSize: "cover", // Ensures the image covers the entire screen
    backgroundRepeat: "no-repeat", // Prevents repeating
    backgroundPosition: "center", // Ensures proper alignment
  }}
>
  <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto  bg-opacity-50 p-6 rounded-lg shadow-lg">
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 rounded-xl shadow-xl text-white max-w-screen-md mx-auto"
    >
      <h2 className="text-3xl font-bold text-center">Edit Artist Profile</h2>

      {/* Name */}
      <div>
        <label className="block text-lg font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-lg font-semibold">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-lg font-semibold">Specialties</label>
        <input
          type="text"
          name="specialties"
          value={formData.specialties}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Social Media */}
      <div>
        <label className="block text-lg font-semibold">Social Media</label>
        {Object.keys(formData.social_media).map((platform) => {
            
            const platformCleanURL = formData.social_media[platform].replace(/[\s{}"]/g, '').trim();
            const platformClean = platform.replace(/[\s{}"]/g, '').trim();
            return (
          <input
            key={platformClean}
            type="url"
            name={`social_media.${platformClean}`}
            value={platformCleanURL}
            onChange={handleInputChange}
            placeholder={`${platformClean} URL`}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg mb-2"
          />
        )})}
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-lg font-semibold">Years of Experience</label>
        <input
          type="number"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Styles */}
      <div>
        <label className="block text-lg font-semibold">Styles</label>
        <input
          type="text"
          name="styles"
          value={formData.styles}
          onChange={handleStylesChange}
          placeholder="Comma-separated styles (e.g., Realism, Abstract)"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-lg font-semibold">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-lg font-semibold">Profile Picture URL</label>
        <input
          type="url"
          name="profile_picture"
          value={formData.profile_picture}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

{/* Availability Schedule */}
{/* Availability Schedule */}
{/* Availability Schedule */}
<div>
  <label className="block text-lg font-semibold">Availability Schedule</label>
  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
    const schedule = formData.availability_schedule[day] || { start: "", end: "" };

    // Log the current day and its corresponding schedule
    console.log(`Day: ${day}`, schedule);

    return (
      <div key={day} className="flex items-center space-x-4">
        <label className="w-20 text-gray-200 font-medium">{day}</label>
        <select
          value={schedule.start}
          onChange={(e) => {
            console.log(`Start time changed for ${day}:`, e.target.value);
            handleScheduleChange(day, "start", e.target.value);
          }}
          className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2"
        >
          <option value="Closed">Start</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <select
          value={schedule.end}
          onChange={(e) => {
            console.log(`End time changed for ${day}:`, e.target.value);
            handleScheduleChange(day, "end", e.target.value);
          }}
          className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2"
        >
          <option value="Closed">End</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    );
  })}
</div>


      {/* Certifications */}
      <div>
        <label className="block text-lg font-semibold">Certifications</label>
        <textarea
          name="certifications"
          value={formData.certifications}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Awards */}
      <div>
        <label className="block text-lg font-semibold">Awards</label>
        <textarea
          name="awards"
          value={formData.awards}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
      </div>

      {/* Active Status */}
      <div>
        <label className="block text-lg font-semibold">Is Active</label>
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-3 rounded-lg"
      >
        Save Changes
      </button>
    </form>
    </div>
    </div>
  );
};

export default EditArtist;
