import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePiercing = ({ onPiercingCreated }) => {
  const [artists, setArtists] = useState([]);
  const [showPiercingForm, setShowPiercingForm] = useState(false); // Toggle for piercing form

  const togglePiercingForm = () => setShowPiercingForm((prev) => !prev);

  const [formData, setFormData] = useState({
    
    piercing_type: "",
    jewelry_type: "",
    placement: "",
    artist_id: "",
    studio_location: "",
    appointment_date: "",
    price: "",
    name: "", // Add this field
    phone_number: "", // Add this field
    call_or_text_preference: "", // Add this field
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  // Fetch all artists
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("https://tattooparlorbackend.onrender.com/api/artists");
        setArtists(response.data.artists);
      } catch (err) {
        console.error("Error fetching artists:", err);
        setError("Failed to load artists. Please try again later.");
      }
    };

    fetchArtists();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreatePiercing = async (e) => {
    e.preventDefault();
  
    // Format the appointment date for the backend
    const dateObj = new Date(formData.appointment_date);
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const formattedDate = `${days[dateObj.getDay()]}, ${
      months[dateObj.getMonth()]
    } ${dateObj.getDate()}, ${dateObj.getFullYear()} ${dateObj.toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "2-digit" }
    )}`;
    
    // Prepare the data to send
    const requestData = {
      ...formData,
      appointment_date: formattedDate,
      price: parseFloat(formData.price), // Ensure price is a number
      artist_id: parseInt(formData.artist_id), // Convert artist_id to an integer
    };
  
    try {
      const response = await axios.post("https://tattooparlorbackend.onrender.com/api/piercings", requestData);
      console.log("Backend response:", response.data);
      setSuccessMessage("Piercing created successfully!");
      onPiercingCreated(response.data); // Notify parent of the new piercing
  
      // Reset the form data
      setFormData({
        piercing_type: "",
        jewelry_type: "",
        placement: "",
        artist_id: "",
        studio_location: "",
        appointment_date: "",
        price: "",
        name: "",                     // Add missing field
        phone_number: "",             // Add missing field
        call_or_text_preference: "",  // Add missing field
      });
    } catch (err) {
      console.error("Error creating piercing:", err.response ? err.response.data : err.message);
      setError("Failed to create piercing. Please try again.");
    }
  };
  return (
    <div>
<button
  onClick={togglePiercingForm}
  className="w-60 py-3 bg-gradient-to-r from-black via-red-800 to-black text-center justify-center items-center ml-40 mr-80 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition duration-300 text-2xl p-6"
  style={{
    fontFamily: "'Creepster', cursive", // Add a macabre font like 'Creepster'
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
    letterSpacing: "2px",
  }}
>
  {showPiercingForm ? "Hide Piercing Form" : "Book A Piercing"}
</button>

    {showPiercingForm && (
    
    <div
  className="flex flex-wrap justify-between ml-10 mr-40 mt-0 max-w-lg pb-3  rounded-lg shadow-lg relative"
>
  
    <form
      onSubmit={handleCreatePiercing}
      className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-2xl "
    >
      <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
        Book Piercing Appointment
      </h2>
      {successMessage && (
        <p className="text-center text-green-400 font-semibold mb-4">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="text-center text-red-400 font-semibold mb-4">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <label className="block">
  <span className="text-lg">Name</span>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter client name"
    className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
    required
  />
</label>
<label className="block">
  <span className="text-lg">Phone Number</span>
  <input
    type="tel"
    name="phone_number"
    value={formData.phone_number}
    onChange={handleChange}
    placeholder="Enter phone number"
    className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</label>
<label className="block">
  <span className="text-lg">Contact Preference</span>
  <select
    name="call_or_text_preference"
    value={formData.call_or_text_preference}
    onChange={handleChange}
    className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
    required
  >
    <option value="" disabled>
      Select preference
    </option>
    <option value="call">Call</option>
    <option value="text">Text</option>
  </select>
</label>


        <label className="block">
          <span className="text-lg">Piercing Type</span>
          <input
            type="text"
            name="piercing_type"
            value={formData.piercing_type}
            onChange={handleChange}
            placeholder="Enter piercing type"
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-lg">Jewelry Type</span>
          <input
            type="text"
            name="jewelry_type"
            value={formData.jewelry_type}
            onChange={handleChange}
            placeholder="Enter jewelry type"
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-lg">Placement</span>
          <input
            type="text"
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            placeholder="Enter placement"
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-lg">Artist</span>
          <select
            name="artist_id"
            value={formData.artist_id}
            onChange={handleChange}
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>
              Select an artist
            </option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-lg">Studio Location</span>
          <input
            type="text"
            name="studio_location"
            value={formData.studio_location}
            onChange={handleChange}
            placeholder="Enter studio location"
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-lg">Appointment Date</span>
          <input
            type="datetime-local"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            className="mt-2 p-3 text-black bg-blue-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </label>
        <label className="block">
          <span className="text-lg">Price</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-8 w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transform transition duration-300"
      >
        Submit Piercing
      </button>
    </form>
    
    </div>
              )}
              </div>
  );
};

export default CreatePiercing;
