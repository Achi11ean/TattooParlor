import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [artists, setArtists] = useState([]);
  const { userType } = useAuth();

  const [formData, setFormData] = useState({
    tattoo_style: "",
    tattoo_size: "",
    placement: "",
    artist_id: "",
    studio_location: "",
    appointment_date: "",
    price: "",
    name: "", // New field
    phone_number: "", // New field
    call_or_text_preference: "", // New field
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all bookings and artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await axios.get("http://127.0.0.1:5002/api/bookings");
        const artistsResponse = await axios.get("http://127.0.0.1:5002/api/artists");

        setBookings(bookingsResponse.data.bookings);
        setArtists(artistsResponse.data.artists);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle booking creation
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    // Format the appointment date for the backend
    const formattedDate = new Date(formData.appointment_date).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).replace(' at', ''); // Remove "at" to match backend format
      
    
    // Prepare the data to send
    const requestData = {
      ...formData,
      appointment_date: formattedDate, // Format date to match backend expectations
      price: parseFloat(formData.price), // Ensure price is a number
      artist_id: parseInt(formData.artist_id), // Convert artist_id to an integer
    };
  
    // Debugging logs
    console.log("Form data:", formData); // Inspect raw form data
    console.log("Formatted appointment_date:", formattedDate); // Verify formatted date
    console.log("Request data being sent to backend:", requestData); // Final request payload
    
    try {
      const response = await axios.post("http://127.0.0.1:5002/api/bookings", requestData);
      console.log("Backend response:", response.data); // Log successful response
      setBookings((prevBookings) => [...prevBookings, response.data]); // Add new booking to the state
      setSuccessMessage("Booking created successfully!");
      setFormData({
        tattoo_style: "",
        tattoo_size: "",
        placement: "",
        artist_id: "",
        studio_location: "",
        appointment_date: "",
        price: "",
        name: "", // Reset new field
        phone_number: "", // Reset new field
        call_or_text_preference: "", // 
      }); // Reset form
    } catch (err) {
      // Log full error for debugging
      console.error("Error creating booking:", err.response ? err.response.data : err.message);
      setError("Failed to create booking. Please try again.");
    }
  };
  

  if (loading) return <div className="text-center py-6">Loading bookings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div
  className="p-6 bg-cover bg-center bg-no-repeat min-h-screen"
  style={{
    backgroundImage: "url('bookings.webp')",
  }}
>
  {/* Your form and other content go here */}
  <div
  className="mt-10 max-w-4xl mx-auto p-6 rounded-lg shadow-lg relative"
  style={{
    backgroundImage: `
      linear-gradient(
        to bottom, 
        rgba(34, 193, 195, 0.6),   /* Greenish teal */
        rgba(45, 137, 239, 0.6),   /* Vibrant blue */
        rgba(0, 0, 0, 0.6),        /* Black */
        rgba(252, 211, 77, 0.6)    /* Warm yellow */
      ),
      url('your-background-image.jpg')
    `,
  }}
>
      <h1 className="text-3xl font-bold mb-6 text-center">Booking</h1>

      {/* Booking Form */}
      <form
  onSubmit={handleCreateBooking}
  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-3xl mx-auto"
>
  <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
    Create New Booking
  </h2>
  {successMessage && (
    <p className="text-center text-green-400 font-semibold mb-4">
      {successMessage}
    </p>
  )}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <label className="block">
      <span className="text-sm text-white">Name</span>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-sm text-white">Phone Number</span>
      <input
        type="tel"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Enter phone number"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg text-white">Call or Text Preference</span>
      <select
        name="call_or_text_preference"
        value={formData.call_or_text_preference}
        onChange={handleChange}
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black"
        required
      >
        <option value="" disabled>
          Choose preference
        </option>
        <option value="call">Call</option>
        <option value="text">Text</option>
      </select>
    </label>
    <label className="block">
      <span className="text-lg text-white">Tattoo Style</span>
      <input
        type="text"
        name="tattoo_style"
        value={formData.tattoo_style}
        onChange={handleChange}
        placeholder="Enter tattoo style"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg">Tattoo Size</span>
      <input
        type="text"
        name="tattoo_size"
        value={formData.tattoo_size}
        onChange={handleChange}
        placeholder="Enter tattoo size"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg text-white">Placement</span>
      <input
        type="text"
        name="placement"
        value={formData.placement}
        onChange={handleChange}
        placeholder="Enter placement"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg text-white">Artist</span>
      <select
        name="artist_id"
        value={formData.artist_id}
        onChange={handleChange}
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-black"
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
      <span className="text-lg text-white">Studio Location</span>
      <input
        type="text"
        name="studio_location"
        value={formData.studio_location}
        onChange={handleChange}
        placeholder="Enter studio location"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg text-white">Appointment Date</span>
      <input
        type="datetime-local"
        name="appointment_date"
        value={formData.appointment_date}
        onChange={handleChange}
        className="mt-2 p-3 text-black bg-blue-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
    <label className="block">
      <span className="text-lg text-white">Price</span>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Enter price"
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-black"
        required
      />
    </label>
  </div>
  <button
    type="submit"
    className="mt-8 w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transform transition duration-300"
  >
    Submit Booking
  </button>
</form>

</div>
      {/* Booking List */}
      {(userType === "artist" || userType === "admin") && (

<div
  className="mt-10 max-w-4xl mx-auto p-6 rounded-lg shadow-lg relative"
  style={{
    backgroundImage: `
      linear-gradient(
        to bottom, 
        rgba(34, 193, 195, 0.6),   /* Greenish teal */
        rgba(45, 137, 239, 0.6),   /* Vibrant blue */
        rgba(0, 0, 0, 0.6),        /* Black */
        rgba(252, 211, 77, 0.6)    /* Warm yellow */
      ),
      url('your-background-image.jpg')
    `,
  }}
>
  <h2 className="text-3xl font-semibold mb-6 text-center text-white">
    Existing Bookings
  </h2>
  <div className="flex overflow-x-auto space-x-6 p-4 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-lg">
    {bookings.map((booking) => (
      <div
        key={booking.id}
        className="flex-none w-72 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md p-6 text-white hover:scale-105 transform transition-transform duration-300"
      >
        <h3 className="text-xl font-bold text-pink-400">{booking.name}</h3>
        <p className="text-sm text-gray-400 mt-2">
          <span className="font-semibold text-gray-200">Booking Date:</span>{" "}
          {new Date(booking.booking_date).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Appointment Date:</span>{" "}
          {new Date(booking.appointment_date).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Phone Number:</span>{" "}
          {booking.phone_number}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Contact Preference:</span>{" "}
          {booking.call_or_text_preference}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Style:</span>{" "}
          {booking.tattoo_style}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Size:</span>{" "}
          {booking.tattoo_size}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Placement:</span>{" "}
          {booking.placement}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Artist:</span>{" "}
          {artists.find((artist) => artist.id === booking.artist_id)?.name || "N/A"}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Location:</span>{" "}
          {booking.studio_location}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Price:</span> $
          {booking.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Payment Status:</span>{" "}
          {booking.payment_status}
        </p>
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">Status:</span>{" "}
          {booking.status}
        </p>
      </div>
    ))}
  </div>
</div>
      )}

    </div>
  );
};

export default Booking;
