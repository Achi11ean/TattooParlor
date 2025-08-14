import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./NavHome/NavBar";
import Services from "./Services";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Artists from "./Artist";
import CreateArtist from "./CreateArtist";
import ArtistProfile from "./ArtistProfile";
import Reviews from "./Reviews";
import Booking from "./Booking";
import GalleryPage from "./GalleryPage";
import About from "./About";
import AdminDashboard from "./AdminDashboard";
import Contact from "./Contact";
import ContactCenter from "./ContactCenter";
import EditArtist from "./EditArtist";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import Subscribe from "./Subscribe";
import NewsletterPage from "./NewsletterPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen w-screen text-white flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Hero Section */}
                <header className="relative bg-black text-center text-white">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: "url('/customtattoos.webp')",
                    }}
                  ></div>
                  <div className="relative bg-black bg-opacity-50 py-16 sm:py-20 px-4">
                    <div className="flex-shrink-0">
                      <a
                        href="/"
                        className="text-5xl sm:text-7xl lg:text-9xl font-extrabold tracking-wide text-white"
                        style={{ fontFamily: "'Deutsch Gothic', serif" }}
                      >
                        Ink Haven
                      </a>
                    </div>
                    <hr className="border-t-4 border-white my-" />

                    <p className=" bg-black/60 text-lg sm:text-2xl lg:text-3xl text-gray-300 px-4">
                      Custom Tattoos | Piercings <br/> Designs | Consultations
                    </p>
<hr className="border-t-4 border-white " />

                  {/* Action Buttons */}
<div className="py-2 text-center">
  <div className="mt-6 grid grid-cols-3 gap-3 max-w-5xl mx-auto px-2">
    <Link
      to="/bookings"
      className="w-full px-4 py-3 text-sm sm:text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-black to-blue-700 text-white 
                 hover:from-blue-700 hover:to-black transform hover:scale-105 transition-all duration-300"
    >
      Book
    </Link>
    <Link
      to="/artists"
      className="w-full px-4 py-3 text-sm sm:text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-red-700 to-black text-white 
                 hover:from-black hover:to-red-700 transform hover:scale-105 transition-all duration-300"
    >
      Artists
    </Link>
    <Link
      to="/contact"
      className="w-full px-4 py-3 text-sm sm:text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-yellow-400 to-black text-white 
                 hover:from-yellow-500 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300"
    >
      Contact
    </Link>
  </div>
</div>


                    <Subscribe />
                  </div>
                </header>

                {/* Services Section */}
                <Services />
              </>
            }
          />

          {/* Other Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/create-artist" element={<CreateArtist />} />
          <Route path="/artists/:id" element={<ArtistProfile />} />
          <Route path="/artists/:artistId/reviews" element={<Reviews />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<ContactCenter />} />
          <Route path="/artists/edit/:id" element={<EditArtist />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/newsletters" element={<NewsletterPage />} />
        </Routes>

        {/* Footer */}
{/* Footer */}
<footer className="relative overflow-hidden bg-gray-900 text-gray-300 py-4">
  {/* Top gradient bar */}
  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />

  {/* Content */}
  <div className="container mx-auto relative flex flex-col items-center justify-center space-y-2 text-center group">
    <a
      href="https://jwhitproductions.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="
        relative inline-block uppercase tracking-wider font-semibold
        text-yellow-400 text-xs sm:text-sm transition-colors duration-300 hover:text-yellow-300
        after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full
        [background:linear-gradient(to_right,rgba(255,255,255,0)_20%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0)_80%)]
        [background-size:200px_100%] animate-[shimmer_2s_linear_infinite]
        px-[2px] py-[3px] rounded
      "
    >
      &copy; {new Date().getFullYear()} Jwhit Productions
    </a>

    <p className="mt-1 text-[11px] sm:text-xs tracking-wide text-gray-400">
      All Rights Reserved. This website and its contents are copyrighted materials © Jwhit Productions.
    </p>

    {/* Tooltip */}
    <span
      className="
        pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2
        whitespace-nowrap rounded-md px-3 py-1 text-[11px] text-white
        opacity-0 shadow-md transition-opacity duration-300
        bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]
        group-hover:opacity-100
      "
    >
      Visit our main site
    </span>
  </div>

  {/* Bottom gradient bar */}
  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />

  {/* Shimmer keyframes */}
  <style>{`
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: 200px 0; }
    }
  `}</style>
</footer>

      </div>
    </Router>
  );
};

export default App;
