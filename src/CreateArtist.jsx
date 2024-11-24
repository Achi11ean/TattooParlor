import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CreateArtist = ({ onArtistCreated }) => {
  const { authToken } = useAuth(); // Correctly retrieve the token from AuthContext

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
        "http://127.0.0.1:5002/api/artists",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Use authToken from AuthContext
          },
        }
      );
      onArtistCreated(response.data.artist);
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Artist</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-gray-700 font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-gray-700 font-medium">Specialties</label>
          <input
            type="text"
            name="specialties"
            value={formData.specialties}
            onChange={handleInputChange}
            placeholder="e.g., Realism, Portraits"
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Social Media */}
        <div>
          <label className="block text-gray-700 font-medium">Social Media</label>
          <div className="flex flex-col gap-2">
            <input
              type="url"
              name="social_media.facebook"
              value={formData.social_media.facebook}
              onChange={handleInputChange}
              placeholder="Facebook URL"
              className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="url"
              name="social_media.instagram"
              value={formData.social_media.instagram}
              onChange={handleInputChange}
              placeholder="Instagram URL"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-gray-700 font-medium">Years of Experience</label>
          <input
            type="number"
            name="years_of_experience"
            value={formData.years_of_experience}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Styles */}
        <div>
          <label className="block text-gray-700 font-medium">Styles</label>
          <input
            type="text"
            name="styles"
            onChange={handleStylesChange}
            placeholder="Comma-separated values"
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-gray-700 font-medium">Profile Picture URL</label>
          <input
            type="url"
            name="profile_picture"
            value={formData.profile_picture}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
  <label className="block text-gray-700 font-medium">Availability Schedule</label>
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(formData.availability_schedule).map(([day, schedule]) => (
      <div key={day} className="flex items-center space-x-4">
        <label className="block text-gray-700 font-medium w-20">{day}</label>
        <select
          value={schedule.start}
          onChange={(e) => handleScheduleChange(day, "start", e.target.value)}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
        >
          <option value="">Start</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <select
          value={schedule.end}
          onChange={(e) => handleScheduleChange(day, "end", e.target.value)}
          className="border rounded-md px-4 py-2 focus:ring focus:ring-blue-500"
        >
          <option value="">End</option>
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
          <label className="block text-gray-700 font-medium">Certifications</label>
          <textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Awards */}
        <div>
          <label className="block text-gray-700 font-medium">Awards</label>
          <textarea
            name="awards"
            value={formData.awards}
            onChange={handleInputChange}
            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Create Artist
        </button>
      </form>
    </div>
  );
};

export default CreateArtist;
