import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar"; // Import the calendar component
import axios from "axios";
import "react-calendar/dist/Calendar.css"; // Import default styles for the calendar
import Reviews from "./Reviews"; // Import the Reviews component
import Gallery from "./Gallery";
import BookingCalendar from "./BookingCalendar";
import { useAuth } from "./AuthContext";

const ArtistProfile = () => {
  const { id } = useParams(); // Get artist ID from URL params
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [bookings, setBookings] = useState([]); // State to store bookings
  const [loading, setLoading] = useState(true);
  const { userType, authToken } = useAuth(); // Get authToken and userType from AuthContext
  const isArtist = artist?.created_by === parseInt(localStorage.getItem("user")?.id); // Match created_by with logged-in user ID
  const isAdmin = userType === "admin"; // Check if the user is an admin
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const SocialMediaIcon = ({ platform }) => {
    const icons = {
      facebook: (
        <i className="fab fa-facebook text-blue-600 text-4xl  rounded-full"></i>
      ),
      instagram: (
        <i className="fab fa-instagram text-pink-500 text-4xl p-2 rounded-full"></i>
      ),
      twitter: (
        <i className="fab fa-twitter text-blue-400 text-4xl p-2 rounded-full"></i>
      ),
      linkedin: (
        <i className="fab fa-linkedin text-blue-700 text-4xl p-2 rounded-full"></i>
      ),
    };
  
    return (
      <span className="inline-flex items-center justify-center">
        {icons[platform.toLowerCase()] || (
          <i className="fas fa-link text-gray-500 text-2xl p-2 rounded-full"></i>
        )}
      </span>
    );
  };
  
  // Fetch artist data by ID
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`https://tattooparlorbackend.onrender.com/api/artists/${id}`);
        setArtist(response.data);

        // Fetch bookings for the artist
        const bookingsResponse = await axios.get(
          `https://tattooparlorbackend.onrender.com/api/artists/${id}/bookings`
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
  const bookingsForDate = bookings.filter((booking) => {
    const appointmentDate = new Date(Date.parse(booking.appointment_date));
    return appointmentDate.toDateString() === selectedDate.toDateString();
  });
  
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
                  {/* Average Rating Section */}
                  <div className="mt-0 ml-40 bg-gradient-to-b from-red-600 via-red-900 to-black p-2 rounded-lg shadow-lg text-center">
                  <h2 className="text-xl underline font-semibold mb-2">Average Rating</h2>
  <div className="text-gray-700 flex items-center">
    {artist.average_rating ? (
      <>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-3xl ${
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
        
        <button
  onClick={() => window.location.href = "https://your-stripe-payment-link-here"}
  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden"
>
  
  <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-red-500 to-pink-500 opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-full"></span>
  <span className="relative z-10 font-semibold text-lg uppercase tracking-wider">
    Process Payment 
  </span>
</button>




        {/* Social Media Section */}
{/* Social Media Section */}
<div className="mt-6">
  <h2 className="text-xl font-semibold mb-4">Connect with Us</h2>
  {Object.keys(socialMedia).length > 0 ? (
    <div className="flex  flex-wrap gap-4">
      {Object.entries(socialMedia).map(([platform, handle]) => {
        const sanitizedHandle = handle.replace(/["'{}]/g, '').trim();
        const sanitizedPlatform = platform.replace(/["'{}]/g, '').trim();
        return handle != '""' ? (
        <a
          key={sanitizedPlatform}
          href={sanitizedHandle}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-300 text-gray-800 rounded-lg shadow-md hover:from-pink-400 hover:via-purple-500 hover:to-green-400 hover:shadow-lg transition duration-300 hover:animate-wobble hover:text-white"
          >
          <SocialMediaIcon platform={sanitizedPlatform} /> 
          <span className="font-medium capitalize">{sanitizedPlatform}</span>
        </a>
      ) : null})}
    </div>
  ) : (
    <p className="text-white">No social media links available.</p>
  )}
</div>
{/* Bookings Section */}
<div className="mt-6">
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    {/* Calendar Component */}
    <div
className="w-full bg-gradient-to-br from-purple-800 via-yellow-500 to-green-600 p-4 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition-shadow duration-300"
>
      <h3 className="text-center text-white text-2xl font-semibold mb-4">
        Artist Booking Calendar
      </h3>
      <Calendar
  onChange={(date) => {
    setSelectedDate(date);

    // Filter bookings for the selected date and include time
    const filteredBookings = bookings.filter(
      (booking) =>
        new Date(booking.appointment_date).toDateString() ===
        date.toDateString()
    );

    console.log("Bookings for selected date:", filteredBookings);

    // Optionally, handle any logic for displaying or using the filtered bookings
  }}
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
          new Date(booking.appointment_date).toDateString() ===
          date.toDateString()
      )
    ) {
      return (
        <span className="block w-2 h-2 bg-yellow-500 rounded-full mx-auto mt-1"></span>
      );
    }
    return null;
  }}

  navigationLabel={({ date, label, locale, view }) => (
    <div
      style={{
        color: "white",
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


  </div>
</div>
<br/>
<div
  className="flex-1 bg-gradient-to-bl from-purple-600 via-yellow-400 to-green-500 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
>
  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
    Selected Date: <br /> {selectedDate.toDateString()}
  </h3>
  {bookingsForDate.length > 0 ? (
    <ul
      className="space-y-4 text-black overflow-y-auto scrollbar-custom"
      style={{
        maxHeight: "160px", // Restrict height for scrolling
      }}
    >
      {bookingsForDate.map((booking, index) => {
        const appointmentDate = new Date(Date.parse(booking.appointment_date));
        return (
          <li
            key={index}
            className="p-4 text-white text-center bg-gradient-to-r from-red-900 via-red-800 to-black border-l-8 border-white-500 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300"
          >
            <strong className="text-white text-center">Time:</strong>{" "}
            {appointmentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            <br />
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-black text-lg">No bookings for this date.</p>
  )}
</div>
<br/>

 <br/>
<div>
  <Gallery artistId={id} isArtist={isArtist} isAdmin={isAdmin} />

    </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2"></h2>
          <Reviews artistId={id} />
        </div>
        
      </div>
      
    </div>
  );
};

export default ArtistProfile;
