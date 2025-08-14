import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [mainTab, setMainTab] = useState("artists"); // NEW: main tab state
  const [activeTab, setActiveTab] = useState("customTattoos");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("https://tattooparlorbackend.onrender.com/api/artists?page=1&per_page=100")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data && data.artists) {
          setArtists(data.artists);
        } else {
          console.error("Unexpected response structure:", data);
        }
      })
      .catch((error) => console.error("Error fetching artists:", error));
  }, []);

  const services = {
    customTattoos: {
      title: "Custom Tattoos",
      description:
        "Bring your vision to life with personalized designs. Work with our expert tattoo artists to create something truly unique.",
      image: "/custom1.webp",
    },
    customPiercings: {
      title: "Custom Piercings",
      description:
        "Precision piercings for your perfect look. Our experienced staff ensures safety and style.",
      image: "piercing1.webp",
    },
    tattooAftercare: {
      title: "Tattoo Aftercare",
      description:
        "Expert advice and products for tattoo care. Keep your ink vibrant and your skin healthy.",
      image: "aftercare1.webp",
    },
  };

  return (
    <section
      className="relative py-12 md:py-20 text-white overflow-hidden min-h-screen"
      style={{ background: "linear-gradient(to bottom, #8B0000, #000000)" }}
    >
      {/* Falling Skulls */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="falling-object"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          >
            <span className="text-4xl opacity-70">
              {Math.random() > 0.5 ? "💀" : "🪦"}
            </span>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center gap-6 mb-10 relative z-10">
        <button
          onClick={() => setMainTab("artists")}
          className={`px-6 py-1 text-lg font-bold rounded-full transition-colors duration-300 ${
            mainTab === "artists"
              ? "bg-white text-black"
              : "bg-black border border-white text-white hover:bg-gray-800"
          }`}
        >
          Artists
        </button>
        <button
          onClick={() => setMainTab("services")}
          className={`px-6 py-1 text-lg font-bold rounded-full transition-colors duration-300 ${
            mainTab === "services"
              ? "bg-white text-black"
              : "bg-black border border-white text-white hover:bg-gray-800"
          }`}
        >
          Services
        </button>
      </div>

      {/* Artists Section */}
     {/* Artists Section */}
{mainTab === "artists" && (
  <>
    <h2
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="text-4xl z-10 border-2 rounded bg-black/60 font-bold mb-4 text-center relative"
    >
      Our Artists
    </h2>

    {artists.length > 0 ? (
      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 md:px-8 lg:px-12 mb-16">
        {artists.map((artist) => (
          <Link
            to={`/artists/${artist.id}`}
            key={artist.id}
            className="relative z-10 cursor-pointer text-center block transform transition-all duration-500 hover:scale-110 group"
          >
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-gray-800 group-hover:border-red-600">
              <img
                src={artist.profile_picture || "/default-artist.jpg"}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
                <span
                  className="text-white text-sm sm:text-base md:text-lg font-semibold drop-shadow-md"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {artist.name}
                </span>
              </div>
            </div>
          </Link>
          
        ))}
      </div>
    ) : (
      <p className="relative z-10 text-center text-gray-400 text-2xl">
        No artists available at the moment. Please check back later!
      </p>
    )}
  </>
)}


      {/* Services Section */}
      {mainTab === "services" && (
        <div className="w-full mx-auto px-8 relative z-10">
          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl border-2 rounded bg-black/60 font-bold mb-4 text-center"
          >
            Our Services
          </h2>

          {/* Image Tabs */}
<div className="flex justify-center mb-12 border-b border-gray-600">
  {Object.keys(services).map((key) => (
    <button
      key={key}
      onClick={() => setActiveTab(key)}
      style={{ fontFamily: "'Playfair Display', serif" }}
      className={`
        relative px-6 py-3 text-lg font-semibold transition-all duration-300
        ${
          activeTab === key
            ? "text-white bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626] rounded-t-lg shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-gray-800 rounded-t-lg"
        }
      `}
    >
      {services[key].title}
      {activeTab === key && (
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />
      )}
    </button>
  ))}
</div>


          {/* Service Content */}
          <div className="text-center">
{activeTab === "customTattoos" && (
  <div
    className="max-w-4xl bg-black border-4 border-white rounded mx-auto text-left px-4 sm:px-6"
    style={{ maxHeight: "450px", overflowY: "auto" }}
  >
<div className="text-center">    <h3
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-4 sm:mb-6 border-b-2 tet-center"
    >
    You Dream It, We Ink It
    </h3> </div>
    <p
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="text-white text-center font-bold text-base sm:text-lg md:text-2xl mb-4 sm:mb-6 leading-relaxed"
    >
      Our tattoo artists specialize in creating custom designs that reflect
      your personality and vision.
      <br className="hidden sm:block" /> Whether you want a minimal design, a
      bold statement piece, or a cover-up, we work closely with you to bring
      your ideas to life.
    </p>
    <ul
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="list-disc font-bold text-center list-inside text-white text-base sm:text-lg md:text-2xl space-y-2"
    >
      <li>Minimalist line work</li>
      <li>Black-and-gray realism</li>
      <li>Colorful illustrative pieces</li>
      <li>Custom lettering and calligraphy</li>
    </ul>
  </div>
)}


      {activeTab === "customPiercings" && (
  <div
    className="max-w-4xl bg-black border-4 border-white rounded mx-auto text-left px-4 sm:px-6"
    style={{ maxHeight: "450px", overflowY: "auto" }}
  >
    <div className="text-center">
      <h3
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-4 sm:mb-6 border-b-2 text-center"
      >
        Custom Piercings: Perfectly You
      </h3>
    </div>
    <p
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="text-white text-center font-bold text-base sm:text-lg md:text-2xl mb-4 sm:mb-6 leading-relaxed"
    >
      Our piercers specialize in creating a safe and stylish experience for all
      your piercing needs.
    </p>
    <ul
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="list-disc font-bold text-center list-inside text-white text-base sm:text-lg md:text-2xl space-y-2"
    >
      <li>High-quality, sterile equipment</li>
      <li>Wide variety of jewelry options</li>
      <li>Personalized aftercare instructions</li>
      <li>Experienced and friendly staff</li>
    </ul>
  </div>
)}

        {activeTab === "tattooAftercare" && (
  <div
    className="max-w-4xl bg-black border-4 border-white rounded mx-auto text-left px-4 sm:px-6"
    style={{ maxHeight: "450px", overflowY: "auto" }}
  >
    <div className="text-center">
      <h3
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-4 sm:mb-6 border-b-2 text-center"
      >
        Tattoo Aftercare: <br/> Keep It Vibrant
      </h3>
    </div>
    <ul
      style={{ fontFamily: "'Playfair Display', serif" }}
      className="list-disc font-bold text-center list-inside text-white text-base sm:text-lg md:text-2xl space-y-2"
    >
      <li>
        Leave the bandage on for at least two hours after your session.
      </li>
      <li>Wash gently with mild soap and lukewarm water.</li>
      <li>Pat dry with a clean towel — never rub.</li>
      <li>Apply a thin layer of recommended moisturizer or ointment.</li>
      <li>Avoid swimming, tanning, or scratching while healing.</li>
    </ul>
  </div>
)}

          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
