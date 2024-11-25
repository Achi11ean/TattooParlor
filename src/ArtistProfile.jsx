import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar"; // Import the calendar component
import axios from "axios";
import "react-calendar/dist/Calendar.css"; // Import default styles for the calendar
import Reviews from "./Reviews"; // Import the Reviews component
import Gallery from "./Gallery";

const ArtistProfile = () => {
  const { id } = useParams(); // Get artist ID from URL params
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [bookings, setBookings] = useState([]); // State to store bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const SocialMediaIcon = ({ platform }) => {
    const icons = {
      facebook: <i className="fab fa-facebook text-blue-600"></i>, // FontAwesome or custom SVG
      instagram: <i className="fab fa-instagram text-pink-500"></i>,
      twitter: <i className="fab fa-twitter text-blue-400"></i>,
      linkedin: <i className="fab fa-linkedin text-blue-700"></i>,
      // Add more platforms as needed
    };
  
    return icons[platform.toLowerCase()] || <i className="fas fa-link text-gray-500"></i>; // Default icon
  };
  
  // Fetch artist data by ID
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5002/api/artists/${id}`);
        setArtist(response.data);

        // Fetch bookings for the artist
        const bookingsResponse = await axios.get(
          `http://127.0.0.1:5002/api/artists/${id}/bookings`
        );
        setBookings(bookingsResponse.data); // Set bookings data
      } catch (err) {
        console.error("Error fetching artist:", err);
        setError("Failed to load artist profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <div>Loading artist profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!artist) return <div className="text-gray-500">Artist not found.</div>;

  // Safeguards for potential null or invalid data
  const styles = Array.isArray(artist.styles) ? artist.styles : [];
  const availabilitySchedule =
    typeof artist.availability_schedule === "object" && artist.availability_schedule !== null
      ? artist.availability_schedule
      : {};
  const socialMedia =
    typeof artist.social_media === "object" && artist.social_media !== null
      ? artist.social_media
      : {};

  // Filter bookings for the selected date
  const bookingsForDate = bookings.filter(
    (booking) => booking.date === selectedDate.toISOString().split("T")[0]
  );

  return (
<div
  className="p-6 min-h-screen w-screen"
  style={{
    backgroundImage: "url('/profile3.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>      <button
        onClick={() => navigate("/artists")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Back to Artists
      </button>

      <div
      className="p-6 max-w-screen-md  min-h-screen  text-white"
      style={{
        background: "linear-gradient(to bottom, royalblue, black)", // Gradient background
      }}
    >        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={artist.profile_picture || "https://via.placeholder.com/150"}
            alt={artist.name}
            className="w-40 h-40 object-cover rounded-full shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <p className="text-white">{artist.specialties || "Specialties not specified"}</p>
            <p className="text-white text-sm mt-2">{artist.bio || "No bio available."}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p className="text-white">
              <strong>Location:</strong> {artist.location || "N/A"}
            </p>
            <p className="text-white">
              <strong>Years of Experience:</strong> {artist.years_of_experience || "N/A"}
            </p>
            <p className="text-white">
              <strong>Styles:</strong> {styles.length > 0 ? styles.join(", ") : "Not specified"}
            </p>
            <p className="text-white">
              <strong>Certifications:</strong> {artist.certifications || "None"}
            </p>
            <p className="text-white">
              <strong>Awards:</strong> {artist.awards || "None"}
            </p>
          </div>
        </div>

{/* Bookings Section */}
<div className="mt-6">
  <h2 className="text-3xl font-bold mb-6 text-center">Bookings</h2>
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    {/* Calendar Component */}
    <div
      className="w-full md:w-1/2 p-4 bg-gradient-to-br from-red-500 via-yellow-700 to-black shadow-xl rounded-lg"
    >
      <h3 className="text-center text-white text-2xl font-semibold mb-4">
        Select a Date
      </h3>
      <Calendar
  onChange={setSelectedDate}
  value={selectedDate}
  className="w-full bg-gradient-to-br from-red-700 via-blue-900 to-black p-4 rounded-lg shadow-xl"
  tileClassName={({ date, view }) =>
    view === "month"
      ? "hover:bg-blue-300 text-white transition ease-in-out duration-300 rounded-lg p-2"
      : undefined
  }
  tileContent={({ date, view }) => {
    // Add dots for dates with bookings
    if (
      bookings.some(
        (booking) =>
          new Date(booking.date).toDateString() === date.toDateString()
      )
    ) {
      return (
        <span className="block w-2 h-2 bg-yellow-500 rounded-full mx-auto mt-1"></span>
      );
    }
    return null;
  }}
  tileDisabled={({ date, view }) =>
    view === "month" && new Date(date) < new Date() // Disable past dates
      ? true
      : false
  }
  navigationLabel={({ date, label, locale, view }) => (
    <div
      style={{
        color: "black",
        fontWeight: "bold",
        fontSize: "1.2rem",
        textAlign: "center",
      }}
    >
      {label}
    </div>
  )}
  
  nextLabel=">"
  prevLabel="<"
  next2Label=">>"
  prev2Label="<<"
  navigationClassName="text-black bg-black hover:bg-blue-800 px-4 py-2 rounded"
  
/>

</div>

    {/* Bookings for the selected date */}
    <div
      className="flex-1 bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-300"
    >
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Bookings on {selectedDate.toDateString()}:
      </h3>
      {bookingsForDate.length > 0 ? (
        <ul className="space-y-4">
          {bookingsForDate.map((booking, index) => (
            <li
              key={index}
              className="p-4 bg-black border-l-4 border-blue-600 rounded-lg shadow"
            >
              <strong className="text-gray-800">Time:</strong> {booking.time} <br />
              <strong className="text-gray-800">Client:</strong> {booking.client}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-lg">No bookings for this date.</p>
      )}
    </div>
  </div>
</div>


        {/* Social Media Section */}
{/* Social Media Section */}
<div className="mt-6">
  <h2 className="text-xl font-semibold mb-4">Connect with Us</h2>
  {Object.keys(socialMedia).length > 0 ? (
    <div className="flex flex-wrap gap-4">
      {Object.entries(socialMedia).map(([platform, handle]) => (
        <a
          key={platform}
          href={handle}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          <SocialMediaIcon platform={platform} /> {/* Icon Component */}
          <span className="font-medium capitalize">{platform}</span>
        </a>
      ))}
    </div>
  ) : (
    <p className="text-white">No social media links available.</p>
  )}
</div>


        {/* Average Rating Section */}
        <div className="mt-6">
  <h2 className="text-xl font-semibold mb-2">Average Rating</h2>
  <div className="text-gray-700 flex items-center">
    {artist.average_rating ? (
      <>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl ${
              index < Math.round(artist.average_rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </>
    ) : (
      <p className="text-gray-500">N/A</p>
    )}
  </div>
  <div>
  <Gallery
  artistId={id} // Use id here
/>

    </div>
</div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">--------------------------------------------------------------------------------</h2>
          <Reviews artistId={id} />
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
