import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import CreatePiercing from "./CreatePiercing"; // Import the CreatePiercing component

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [artists, setArtists] = useState([]);
  const { userType } = useAuth();
  const [editingPiercing, setEditingPiercing] = useState(null); // Track the piercing being edited
  const [editingBooking, setEditingBooking] = useState(null); // Track the booking being edited
  const [piercings, setPiercings] = useState([]); // Add state for piercings
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [piercingSearchQuery, setPiercingSearchQuery] = useState(""); // Search query for piercings
  const [noBookingResults, setNoBookingResults] = useState(false); // Track no results for bookings
  const [noPiercingResults, setNoPiercingResults] = useState(false); // Track no results for piercings
  const [showBookingForm, setShowBookingForm] = useState(false); // Toggle for booking form
  const [showPiercingForm, setShowPiercingForm] = useState(false); // Toggle for piercing form
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        // If the search query is empty, fetch all bookings
        try {
          const response = await axios.get("https://tattooparlorbackend.onrender.com/api/bookings");
          setBookings(response.data.bookings);
          setNoBookingResults(false); // Reset no results

          setError(null);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError("Failed to load bookings. Please try again later.");
        }
        return;
      }

      try {
        const response = await axios.get("https://tattooparlorbackend.onrender.com/api/bookings/search", {
          params: { name: searchQuery },
        });
        setBookings(response.data); // Update bookings state with search results
        setNoBookingResults(response.data.length === 0); // Check if no results
        setError(null);
      } catch (err) {
        console.error("Error during search:", err);
        setNoBookingResults(true); // No results

        setError(null); // Clear error for a clean "no results" message
      }
    };

    // Delay the search by 300ms for better user experience (debouncing)
    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounce); // Cleanup the timeout on component unmount or query change
  }, [searchQuery]);

  const handleEditBooking = async (e) => {
    e.preventDefault();
  
    // Format the appointment_date to match backend expectations
    const formattedAppointmentDate = new Date(editingBooking.appointment_date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).replace(" at", ""); // Remove "at" to match backend format
  
    const updatedBooking = {
      ...editingBooking,
      appointment_date: formattedAppointmentDate, // Use the formatted date
    };
  
    try {
      const response = await axios.patch(
        `https://tattooparlorbackend.onrender.com/api/bookings/${editingBooking.id}`,
        updatedBooking
      );
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === response.data.id ? response.data : booking
        )
      );
      setEditingBooking(null);
      setSuccessMessage("Booking updated successfully!");
    } catch (err) {
      console.error("Error updating booking:", err.response ? err.response.data : err.message);
      setError("Failed to update booking. Please try again.");
    }
  };
  
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
  const handleEditPiercing = async (e) => {
    e.preventDefault();
  
    // Format the appointment_date to match backend expectations
    const formattedAppointmentDate = new Date(editingPiercing.appointment_date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).replace(" at", ""); // Remove "at" to match backend format
  
    const updatedPiercing = {
      ...editingPiercing,
      appointment_date: formattedAppointmentDate, // Use the formatted date
    };
  
    try {
      const response = await axios.patch(
        `https://tattooparlorbackend.onrender.com/api/piercings/${editingPiercing.id}`,
        updatedPiercing
      );
      setPiercings((prevPiercings) =>
        prevPiercings.map((piercing) =>
          piercing.id === response.data.id ? response.data : piercing
        )
      );
      setEditingPiercing(null);
      setSuccessMessage("Piercing updated successfully!");
    } catch (err) {
      console.error("Error updating piercing:", err.response ? err.response.data : err.message);
      setError("Failed to update piercing. Please try again.");
    }
  };
  const toggleBookingForm = () => setShowBookingForm((prev) => !prev);
  const togglePiercingForm = () => setShowPiercingForm((prev) => !prev);
  const [error, setError] = useState(null);
    // Fetch piercings dynamically on piercingSearchQuery change
    useEffect(() => {
      const fetchPiercingSearchResults = async () => {
        if (!piercingSearchQuery.trim()) {
          try {
            const response = await axios.get("https://tattooparlorbackend.onrender.com/api/piercings");
            setPiercings(response.data.piercings);
            setError(null);
          } catch (err) {
            console.error("Error fetching piercings:", err);
            setError("Failed to load piercings. Please try again later.");
          }
          return;
        }
  
        try {
          const response = await axios.get("https://tattooparlorbackend.onrender.com/api/piercings/search", {
            params: { name: piercingSearchQuery },
          });
          setPiercings(response.data);
          setError(null);
        } catch (err) {
          console.error("Error during piercing search:", err);
          setError(null); // Clear error for a clean "no results" message
        }
      };
  
      const delayDebounce = setTimeout(() => {
        fetchPiercingSearchResults();
      }, 300);
  
      return () => clearTimeout(delayDebounce);
    }, [piercingSearchQuery]);
  
  const [successMessage, setSuccessMessage] = useState("");
  const handlePiercingCreated = (newPiercing) => {
    setPiercings((prevPiercings) => [...prevPiercings, newPiercing]); // Add new piercing to the state
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/bookings/${id}`);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      setSuccessMessage("Booking deleted successfully!");
    } catch (err) {
      console.error("Error deleting booking:", err.response ? err.response.data : err.message);
      setError("Failed to delete booking. Please try again.");
    }
  };
  
  const handleDeletePiercing = async (id) => {
    try {
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/piercings/${id}`);
      setPiercings((prevPiercings) => prevPiercings.filter((piercing) => piercing.id !== id));
      setSuccessMessage("Piercing deleted successfully!");
    } catch (err) {
      console.error("Error deleting piercing:", err.response ? err.response.data : err.message);
      setError("Failed to delete piercing. Please try again.");
    }
  };
  
  
  // Fetch all bookings and artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsResponse = await axios.get("https://tattooparlorbackend.onrender.com/api/bookings");
        const artistsResponse = await axios.get("https://tattooparlorbackend.onrender.com/api/artists");
        const piercingsResponse = await axios.get("https://tattooparlorbackend.onrender.com/api/piercings"); // Fetch piercings
        setBookings(bookingsResponse.data.bookings);
        setArtists(artistsResponse.data.artists);
        setPiercings(piercingsResponse.data.piercings); // Set piercings data

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
      const response = await axios.post("https://tattooparlorbackend.onrender.com/api/bookings", requestData);
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

<div
  className="flex flex-wrap justify-between ml-10 mr-40 mt-2 max-w-8xl pb-3  rounded-lg shadow-lg relative"
>

      {/* Booking Form */}
      <div>
      <button
  onClick={toggleBookingForm}
  className="w-60 py-3 bg-gradient-to-r from-black via-red-800 to-black text-center justify-center items-center ml-60 mr-80 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition duration-300 mt-8 text-2xl p-6"
  style={{
    fontFamily: "'Creepster', cursive", // Macabre font
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.8)",
    letterSpacing: "2px",
  }}
>
  {showBookingForm ? "Hide Booking Form" : "Book A Tattoo"}
</button>

          {showBookingForm && (
      <form
  onSubmit={handleCreateBooking}
  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-lg mx-auto"
>
  <h2 className="text-4xl  font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
    Book Tattoo Appointment
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
          )}
        </div>
<div className="mt-10">
  <CreatePiercing onPiercingCreated={handlePiercingCreated} />
</div>
</div>
<div
  className="flex flex-wrap justify-between ml-10 mr-40 mt-10 max-w-8xl pb-3 rounded-lg shadow-lg relative"
>
<br/>
<br/>
  <br/>
      {/* Booking List */}
      {(userType === "artist" || userType === "admin") && (

<div
  className="mt-10 max-w-3xl ml-20 mx-auto p-6 rounded-lg shadow-lg relative"
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

  <h2 className="text-3xl font-semibold  mb-6 text-center text-white">
    Existing Bookings
  </h2>
  <div className="flex items-center gap-0 mb-2">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)} // Update search query dynamically
      placeholder="Search by client name"
      className="flex-grow p-2 rounded-lg text-white"
    />
  </div>
  {error && <p className="text-red-400">{error}</p>}
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
        <button
        onClick={() => handleDeleteBooking(booking.id)}
        className="mt-4 py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md"
      >
        Delete Booking
      </button>
      <button
  onClick={() => setEditingBooking(booking)} // Set the booking to edit
  className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
>
  Edit Booking
</button>
      </div>
    ))}
  </div>
</div>
      )}

{editingBooking && (
  <form
    onSubmit={handleEditBooking}
    className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-3xl mx-auto"
  >
    <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
      Edit Booking
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <label className="block">
        <span className="text-sm text-white">Name</span>
        <input
          type="text"
          name="name"
          value={editingBooking.name}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, name: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Phone Number</span>
        <input
          type="tel"
          name="phone_number"
          value={editingBooking.phone_number}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, phone_number: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Call or Text Preference</span>
        <select
          name="call_or_text_preference"
          value={editingBooking.call_or_text_preference}
          onChange={(e) =>
            setEditingBooking({
              ...editingBooking,
              call_or_text_preference: e.target.value,
            })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        >
          <option value="call">Call</option>
          <option value="text">Text</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-white">Tattoo Style</span>
        <input
          type="text"
          name="tattoo_style"
          value={editingBooking.tattoo_style}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, tattoo_style: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Tattoo Size</span>
        <input
          type="text"
          name="tattoo_size"
          value={editingBooking.tattoo_size}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, tattoo_size: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Placement</span>
        <input
          type="text"
          name="placement"
          value={editingBooking.placement}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, placement: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Artist</span>
        <select
          name="artist_id"
          value={editingBooking.artist_id}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, artist_id: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
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
        <span className="text-sm text-white">Studio Location</span>
        <input
          type="text"
          name="studio_location"
          value={editingBooking.studio_location}
          onChange={(e) =>
            setEditingBooking({
              ...editingBooking,
              studio_location: e.target.value,
            })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
  <span className="text-sm text-white">Appointment Date</span>
  <input
    type="datetime-local"
    name="appointment_date"
    value={editingBooking.appointment_date || ""}
    onChange={(e) =>
      setEditingBooking({ ...editingBooking, appointment_date: e.target.value })
    }
    className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
    required
  />
</label>


      <label className="block">
        <span className="text-sm text-white">Price</span>
        <input
          type="number"
          name="price"
          value={editingBooking.price}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, price: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-white">Payment Status</span>
        <select
          name="payment_status"
          value={editingBooking.payment_status}
          onChange={(e) =>
            setEditingBooking({
              ...editingBooking,
              payment_status: e.target.value,
            })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-white">Status</span>
        <select
          name="status"
          value={editingBooking.status}
          onChange={(e) =>
            setEditingBooking({ ...editingBooking, status: e.target.value })
          }
          className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
          required
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </label>
    </div>

    <div className="flex gap-4 mt-8">
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg"
      >
        Save Changes
      </button>
      <button
        type="button"
        onClick={() => setEditingBooking(null)} // Cancel editing
        className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold rounded-lg"
      >
        Cancel
      </button>
    </div>
  </form>
)}


{/* -------------------------------------------------------------------------------------------------------------------------------------piercings */}

{userType === "artist" || userType === "admin" ? (
  <div
  className="mt-10 max-w-3xl mx-auto p-6 rounded-lg shadow-lg relative backdrop-blur-md"
  style={{
    background: "linear-gradient(to right, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5))",
  }}
>
  <h2 className="text-3xl font-semibold mb-6 text-center text-white">
      Existing Piercings
    </h2>
    <input
          type="text"
          value={piercingSearchQuery}
          onChange={(e) => setPiercingSearchQuery(e.target.value)}
          placeholder="Search piercings by client name"
          className="flex-grow p-2 rounded-lg text-white w-full mb-4"
        />
    <div className="flex overflow-x-auto space-x-6 p-4 bg-gray-900/70 backdrop-blur-md rounded-lg shadow-lg">
      {piercings.map((piercing) => (
        <div
          key={piercing.id}
          className="flex-none w-72 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-md p-6 text-white hover:scale-105 transform transition-transform duration-300"
        >
          <h3 className="text-xl font-bold text-pink-400">{piercing.name}</h3>
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-gray-200">Piercing:</span> {piercing.piercing_type}
          </p>
          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Jewelry:</span> {piercing.jewelry_type}
          </p>
          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Placement:</span> {piercing.placement}
          </p>
          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Studio:</span> {piercing.studio_location}
          </p>
          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Appointment:</span> <br/>{piercing.appointment_date}
          </p>
          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Price:</span> ${piercing.price}
          </p>

          <p className="text-md text-gray-400">
            <span className="font-semibold text-gray-200">Contact:</span> {piercing.phone_number} ({piercing.call_or_text_preference})
          </p>
          <button
        onClick={() => handleDeletePiercing(piercing.id)}
        className="mt-4 py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md"
      >
        Delete Piercing
      </button>
      <button
  onClick={() => setEditingPiercing(piercing)} // Set the piercing to edit
  className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
>
  Edit Piercing
</button>
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="text-center text-white"></p>
)}
</div>
{editingPiercing && (
  <form
  onSubmit={handleEditPiercing}
  className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-2xl max-w-3xl mx-auto"
>
  <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
    Edit Piercing
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <label className="block">
      <span className="text-sm text-white">Name</span>
      <input
        type="text"
        name="name"
        value={editingPiercing.name}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, name: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Phone Number</span>
      <input
        type="tel"
        name="phone_number"
        value={editingPiercing.phone_number}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, phone_number: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Call or Text Preference</span>
      <select
        name="call_or_text_preference"
        value={editingPiercing.call_or_text_preference}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, call_or_text_preference: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      >
        <option value="call">Call</option>
        <option value="text">Text</option>
      </select>
    </label>

    <label className="block">
      <span className="text-sm text-white">Piercing Type</span>
      <input
        type="text"
        name="piercing_type"
        value={editingPiercing.piercing_type}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, piercing_type: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Jewelry Type</span>
      <input
        type="text"
        name="jewelry_type"
        value={editingPiercing.jewelry_type}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, jewelry_type: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Placement</span>
      <input
        type="text"
        name="placement"
        value={editingPiercing.placement}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, placement: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Studio Location</span>
      <input
        type="text"
        name="studio_location"
        value={editingPiercing.studio_location}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, studio_location: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>
    <label className="block">
      <span className="text-sm text-white">Appointment Time</span>
    <input
  type="datetime-local"
  name="appointment_date"
  value={editingPiercing.appointment_date || ""}

  onChange={(e) =>
    setEditingPiercing({ ...editingPiercing, appointment_date: e.target.value })
  }
  className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
  required
/>
</label>

    <label className="block">
      <span className="text-sm text-white">Price</span>
      <input
        type="number"
        name="price"
        value={editingPiercing.price}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, price: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      />
    </label>

    <label className="block">
      <span className="text-sm text-white">Payment Status</span>
      <select
        name="payment_status"
        value={editingPiercing.payment_status}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, payment_status: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      >
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>
    </label>

    <label className="block">
      <span className="text-sm text-white">Status</span>
      <select
        name="status"
        value={editingPiercing.status}
        onChange={(e) =>
          setEditingPiercing({ ...editingPiercing, status: e.target.value })
        }
        className="mt-2 p-3 text-black bg-pink-200 rounded-lg w-full focus:outline-none"
        required
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>
    </label>
  </div>

  <button
    type="submit"
    className="mt-8 w-80 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg"
  >
    Save Changes
  </button>
  <button
    type="button"
    onClick={() => setEditingPiercing(null)} // Cancel editing
    className="w-80  ml-10 py-3 bg-gradient-to-r  from-pink-500 to-blue-500 text-white font-semibold rounded-lg"
  >
    Cancel
  </button>
</form>
)}



    </div>
  );
};

export default Booking;
