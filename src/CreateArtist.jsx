import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const CreateArtist = ({ onArtistCreated }) => {
  const { authToken } = useAuth(); // Correctly retrieve the token from AuthContext
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    social_media: { facebook: "", instagram: "" },
    years_of_experience: "",
    styles: [],
    location: "",
    profile_picture: "",
    availability_schedule: {
      Monday: { start: "Closed", end: "Closed" },
      Tuesday: { start: "Closed", end: "Closed" },
      Wednesday: { start: "Closed", end: "Closed" },
      Thursday: { start: "Closed", end: "Closed" },
      Friday: { start: "Closed", end: "Closed" },
      Saturday: { start: "Closed", end: "Closed" },
      Sunday: { start: "Closed", end: "Closed" },
    },
    certifications: "",
    awards: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social_media.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social_media: { ...prev.social_media, [field]: value },
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
      styles: e.target.value.split(",").map((style) => style.trim()),
    }));
  };

  const handleScheduleChange = (day, type, value) => {
    setFormData((prev) => {
      const newSchedule = { ...prev.availability_schedule[day], [type]: value };
  
      // Validate: Ensure 'end' is after 'start'
      if (type === "end" && newSchedule.start && newSchedule.end) {
        const startTime = new Date(`1970-01-01T${newSchedule.start}`);
        const endTime = new Date(`1970-01-01T${newSchedule.end}`);
        if (endTime <= startTime) {
          alert("End time must be later than start time.");
          return prev; // Prevent invalid update
        }
      }
  
      return {
        ...prev,
        availability_schedule: {
          ...prev.availability_schedule,
          [day]: newSchedule,
        },
      };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Token:", authToken); // Debug token value

    if (!authToken) {
      setError("Unauthorized: No token available.");
      return;
    }

    try {
      const response = await axios.post(
        "https://tattooparlorbackend.onrender.com/api/artists",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use authToken from AuthContext
          },
        }
      );
      console.log('RESPONSE FROM CREATE', response)
      // Navigate to the artists page after successful creation
      navigate("/artists");
    } catch (err) {
      console.error("Error creating artist:", err);
      setError(err.response?.data?.error || "Something went wrong!");
    }
  };

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 24;
    const period = hour < 12 ? "AM" : "PM";
    const adjustedHour = hour % 12 || 12; // Convert 0 -> 12 for 12-hour format
    return `${adjustedHour}:00 ${period}`;
  });
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('createartist.webp')", // Replace with your image path
      }}
    >
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form 
  onSubmit={handleSubmit} 
  className="space-y-8 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 rounded-xl shadow-xl text-white overflow-y-auto max-h-[80vh] max-w-full  mx-auto">
  <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
    Create Artist Profile
  </h2>

  {/* Name */}
  <div>
    <label className="block text-lg font-semibold">Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      required
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-yellow-300"
    />
  </div>

  {/* Bio */}
  <div>
    <label className="block text-lg font-semibold">Bio</label>
    <textarea
      name="bio"
      value={formData.bio}
      onChange={handleInputChange}
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-yellow-300"
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
      placeholder="e.g., Realism, Portraits"
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400"
    />
  </div>

  {/* Social Media */}
  <div>
  <label className="block text-lg font-semibold">Social Media</label>
  <div className="flex flex-col gap-4">
    {/* Facebook Input */}
    <input
      type="url"
      name="social_media.facebook"
      value={formData.social_media.facebook || ""}
      onChange={handleInputChange}
      placeholder="Facebook URL"
      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400"
    />
    
    {/* Instagram Input */}
    <input
      type="url"
      name="social_media.instagram"
      value={formData.social_media.instagram || ""}
      onChange={handleInputChange}
      placeholder="Instagram URL"
      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-pink-400"
    />

    {/* Twitter Input */}
    <input
      type="url"
      name="social_media.twitter"
      value={formData.social_media.twitter || ""}
      onChange={handleInputChange}
      placeholder="Twitter URL"
      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-blue-300"
    />

    {/* LinkedIn Input */}
    <input
      type="url"
      name="social_media.linkedin"
      value={formData.social_media.linkedin || ""}
      onChange={handleInputChange}
      placeholder="LinkedIn URL"
      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-blue-600"
    />
  </div>
</div>

  {/* Years of Experience */}
  <div>
    <label className="block text-lg font-semibold">Years of Experience</label>
    <input
      type="number"
      name="years_of_experience"
      value={formData.years_of_experience}
      onChange={handleInputChange}
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-green-400"
    />
  </div>

  {/* Styles */}
  <div>
    <label className="block text-lg font-semibold">Styles</label>
    <input
      type="text"
      name="styles"
      onChange={handleStylesChange}
      placeholder="Comma-separated values"
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-purple-400"
    />
  </div>

  {/* Location */}
  <div>
    <label className="block text-lg  font-semibold">Location</label>
    <input
      type="text"
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-teal-400"
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
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-orange-400"
    />
  </div>

  {/* Availability Schedule */}
  <div>
    <label className="block text-lg font-semibold">Availability Schedule</label>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(formData.availability_schedule).map(([day, schedule]) => (
        <div key={day} className="flex items-center space-x-4">
          <label className="text-gray-200 font-medium">{day}</label>
          <select
            value={schedule.start}
            onChange={(e) => handleScheduleChange(day, "start", e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
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
            onChange={(e) => handleScheduleChange(day, "end", e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="Closed">End</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  </div>

  {/* Certifications */}
  <div>
    <label className="block text-lg font-semibold">Certifications</label>
    <textarea
      name="certifications"
      value={formData.certifications}
      onChange={handleInputChange}
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-yellow-300"
    />
  </div>

  {/* Awards */}
  <div>
    <label className="block text-lg font-semibold">Awards</label>
    <textarea
      name="awards"
      value={formData.awards}
      onChange={handleInputChange}
      className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-pink-300"
    />
  </div>

  {/* Submit */}
  <button
    type="submit"
    className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-3 rounded-lg hover:scale-105 transform transition-transform duration-300 font-bold"
  >
    Create Artist
  </button>
</form>

    </div>
  );
};

export default CreateArtist;
