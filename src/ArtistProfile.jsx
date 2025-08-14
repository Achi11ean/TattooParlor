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
const [tab, setTab] = useState(() => localStorage.getItem("artistTab") || "about");
useEffect(() => {
  localStorage.setItem("artistTab", tab);
}, [tab]);

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
  className="p-6 min-h-screen w-screen "
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
<div className="items-center flex justify-center">

      <div
      className="p-1 max-w-screen-xl items-center justify-center  min-h-screen  text-white"
      style={{
        background: "linear-gradient(to bottom, royalblue, black)", // Gradient background
      }}
    >  
    
  <div className="flex bg-black  justify-center mb-6 border-b border-white/40">
        {[
          { key: "about", label: "About" },
          { key: "schedule", label: "Schedule" },
          { key: "gallery", label: "Gallery" },
          { key: "reviews", label: "Reviews" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative px-4 py-1 text-sm sm:text-base font-semibold transition-all  ${
              tab === key
                ? "text-white bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626] shadow"
                : "text-gray-200 hover:text-white hover:bg-white/10"
            }`}
          >
            {label}
            {tab === key && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />
            )}
          </button>
        ))}
      </div>


     <div className="  items-center  gap-6">
  <div className="relative items-center justify-center flex">
    <img
      src={artist.profile_picture || "https://via.placeholder.com/150"}
      alt={artist.name}
      className="w-40 h-40 object-cover rounded-full shadow-md"
    />
    {artist.years_of_experience && (
      <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full shadow-md text-sm">
        {artist.years_of_experience} Yrs
      </span>
    )}
  </div>
  <div>
  </div>
<br/>
          <div>
            <h1 className="text-3xl border-b-2 text-center font-bold">{artist.name}</h1>
            <div className="flex ">
  <button
    onClick={() => window.location.href = "https://your-stripe-payment-link-here"}
    className="bg-black text-white px-4 py-1 rounded shadow-md hover:shadow-lg  transition-all duration-300 ease-in-out relative overflow-hidden"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-red-500 to-pink-500 opacity-0 hover:opacity-30 transition-opacity duration-300"></span>
    <span className="relative z-10 font-semibold text-sm uppercase tracking-wider">
      Process Payment
    </span>
  </button>
</div>
<div className="mt-6 justify-center items-center rouned-2xl border-black border-2 bg-white">
  <h2 className="text-xl text-black text-center font-semibold ">Connect with Us</h2>
  {Object.keys(socialMedia).length > 0 ? (
    <div className="flex items-center bg-black justify-center flex-wrap gap-3">
      {Object.entries(socialMedia).map(([platform, handle]) => {
        const sanitizedHandle = String(handle).replace(/["'{}]/g, "").trim();
        const sanitizedPlatform = String(platform).replace(/["'{}]/g, "").trim();

        if (!sanitizedHandle || sanitizedHandle === '""') return null;

        return (
          <a
            key={sanitizedPlatform}
            href={sanitizedHandle}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={sanitizedPlatform}
            title={sanitizedPlatform}
            className="
              w-12 h-12 rounded-full
              flex items-center justify-center
              bg-white/10 text-white
              hover:bg-white/20 hover:scale-105
              transition duration-200 shadow
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50
            "
          >
            <SocialMediaIcon platform={sanitizedPlatform} />
            <span className="sr-only">{sanitizedPlatform}</span>
          </a>
        );
      })}
    </div>
  ) : (
    <p className="text-white">No social media links available.</p>
  )}
</div>
            <p className="text-white border-2 p-1 font-bold bg-black/60 text-sm mt-2"> <span className="text-center">  <h2 className="text-lg font-bold border-b-2 mb-2">Bio</h2>
</span>{artist.bio || "No bio available."}</p>
<div
  className=" text-white border- bg-black/60 border-2  p-2 max-h-16 overflow-y-auto shadow-md text-center text-xs font-semibold font-serif"
>
  <h2 className="text-lg font-bold border-b-2 mb-2">Certifications</h2>
  <p>
 {artist.certifications || "None"}
  </p>
</div>
<div className="text-black mt-2 p-4 bg-white shadow-md rounded-lg">
  {/* Specialties */}
  <h2 className="text-2xl font-bold text-center text-pink-700 border-b-2 border-pink-300 pb-2 mb-3">
    🎨 Specialties
  </h2>
  {artist.specialties && artist.specialties.trim() !== "" ? (
    <div className="flex flex-wrap capitalize justify-center gap-2 max-h-40 overflow-y-auto">
      {artist.specialties
        .split(",")
        .map((specialty, index) => (
          <span
            key={index}
            className="bg-gradient-to-b from-blue-200 to-blue-300 text-black px-4 py-1 rounded-full text-sm font-semibold shadow-sm border border-pink-300 hover:scale-105 transition-transform duration-200"
          >
            {specialty.trim()}
          </span>
        ))}
    </div>
  ) : (
    <span className="text-gray-500 text-xs italic block text-center mt-2">
      Specialties not specified
    </span>
  )}

  {/* Styles */}
  <h2 className="text-2xl font-bold text-center text-pink-700 border-b-2 border-pink-300 pb-2 mt-6 mb-3">
    🎭 Styles
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {styles.length > 0 ? (
      styles.map((style, index) => (
        <span
          key={index}
          className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-pink-300 text-center"
        >
          {style}
        </span>
      ))
    ) : (
      <span className="text-gray-500 text-xs italic col-span-full text-center">
        Not specified
      </span>
    )}
  </div>
</div>


            
          </div>
          
                  {/* Average Rating Section */}
                        {tab === "reviews" && (

                <div className="mt-0 w-full bg-gradient-to-b from-red-600 via-red-900 to-black p-2 rounded-lg shadow-lg text-center">
  <h2 className="text-xl underline font-semibold mb-2">Average Rating</h2>
  
  <div className="flex justify-center items-center">
    {artist.average_rating ? (
      <>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-3xl animate-pulse ${
              index < Math.round(artist.average_rating)
                ? "text-yellow-400"
                : "text-gray-300"
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
                        )}
        </div>

        {/* Details Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>

  


            <h2 className="border-b-2 text-center mb-2">Certifications</h2>


<div className="text-black rounded-lg mb-2 p-3 bg-white/90 shadow-md">
  <h1 className="text-center text-base sm:text-lg font-bold mb-2">Awards</h1>

  <div className="max-h-32 overflow-y-auto pr-1">
    {artist.awards && String(artist.awards).trim() !== "" ? (
      <div className="flex flex-wrap gap-2 justify-center">
        {(Array.isArray(artist.awards)
          ? artist.awards
          : String(artist.awards).split(",")
        ).map((raw, idx) => {
          const cleaned = String(raw).replace(/^🏆\s*/u, "").trim();
          const [awardTitle, issuer] = cleaned.split(/\s*-\s*/);

          return (
            <div
              key={idx}
              className="bg-yellow-200 text-yellow-900 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm border border-yellow-300 flex flex-col items-center w-auto min-w-[140px] text-center"
            >
              {issuer && (
                <div className="text-[10px] border-b-2 border-black font-bold uppercase text-yellow-800 mb-1">
                  {issuer}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span aria-hidden>🏆</span>
                <span>{awardTitle || "Award"}</span>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-center text-gray-500 text-xs italic">None</p>
    )}
  </div>
</div>


          </div>
        </div>
        







<br/>
      {tab === "schedule" && (
        <div className="mt-6">
<h3 className="text-center text-white text-2xl font-semibold  mb-4 truncate">
        Artist Booking Calendar
      </h3>
{/* Bookings Section */}
<div className="mt-6">
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
    {/* Calendar Component */}
  

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
        fontSize: "1rem",
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
</div>
      )}
<br/>

 <br/>
       {tab === "gallery" && (

<div>
  <Gallery artistId={id} isArtist={isArtist} isAdmin={isAdmin} />

    </div>
       )}
      {tab === "reviews" && (

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2"></h2>
          <Reviews artistId={id} />
        </div>      )}

      </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
