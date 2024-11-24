import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./NavHome/NavBar";
import Services from "./Services";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ArtistDashboard from "./ArtistDashboard";
import Artists from "./Artist";
import CreateArtist from "./CreateArtist";
import ArtistProfile from "./ArtistProfile";
import Reviews from "./Reviews";

const App = () => {

  
  return (
    <Router>
      <div className="h-screen w-screen text-white">
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                {/* Hero Section */}
                <header className="relative bg-black text-center text-white">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: "url('/customtattoos.webp')", // Replace with your image
                    }}
                  ></div>
                  <div className="relative bg-black bg-opacity-50 py-20 px-4">
                    <div className="flex-shrink-0">
                      <a
                        href="/"
                        className="text-9xl font-extrabold tracking-wide hover:text-red-500"
                        style={{ fontFamily: "'Deutsch Gothic', serif" }}
                      >
                        Ink Haven
                      </a>
                    </div>
                    <p className="mt-4 text-xl text-gray-300">
                      Custom Tattoos | Piercings | Designs | Consultations
                    </p>
                    <div className="mt-6 flex justify-center space-x-4">
                      <a
                        href="/book-appointment"
                        className="px-6 py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
                      >
                        Book Now
                      </a>
                      <a
                        href="/artists"
                        className="px-6 py-3 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition"
                      >
                        Explore Artists
                      </a>
                    </div>
                  </div>
                </header>

                {/* Services Section */}
                <Services />
              </>
            }
          />

          {/* Sign-Up Route */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/artist-dashboard" element={<ArtistDashboard />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/create-artist" element={<CreateArtist />} />
          <Route path="/artists/:id" element={<ArtistProfile />} /> {/* Optional for individual profiles */}
          <Route path="/artists/:artistId/reviews" element={<Reviews />} />

          {/* Add other routes here if needed */}
        </Routes>

        {/* Footer */}
        <footer className="bg-black py-8 text-center text-gray-400">
          <p className="text-lg">Ink Haven | 123 Tattoo Lane, Art City, CA 90210</p>
          <p>Email: info@inkhaven.com | Phone: (123) 456-7890</p>
          <div className="mt-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition"
            >
              Contact Us
            </a>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
