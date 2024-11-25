import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./NavHome/NavBar";
import Services from "./Services";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Artists from "./Artist";
import CreateArtist from "./CreateArtist";
import ArtistProfile from "./ArtistProfile";
import Reviews from "./Reviews";
import Booking from "./Booking"; // Import the Booking component
import GalleryPage from "./GalleryPage";
import About from "./About";
import AdminDashboard from './AdminDashboard'; // Adjust the path as needed
import Contact from "./Contact";
import ContactCenter from "./ContactCenter";
import EditArtist from "./EditArtist"; // Adjust the path as needed

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
                        href="/bookings"
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
          <Route path="/artists" element={<Artists />} />
          <Route path="/create-artist" element={<CreateArtist />} />
          <Route path="/artists/:id" element={<ArtistProfile />} /> {/* Optional for individual profiles */}
          <Route path="/artists/:artistId/reviews" element={<Reviews />} />
          <Route path="/bookings" element={<Booking />} /> {/* Add Booking route */}
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<ContactCenter />} />
          <Route path="/artists/edit/:id" element={<EditArtist />} />

          {/* Add other routes here if needed */}
        </Routes>

        {/* Footer */}
        <footer className="bg-black text-white py-6">
  <div className="container mx-auto px-4 text-center">
    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
      {/* Brand Name */}
      <p className="text-lg font-bold tracking-wide">
        Ink Haven
      </p>

      {/* Separator */}
      <div className="hidden md:block w-px h-6 bg-gray-600"></div>

      {/* Year and Rights */}
      <p className="text-sm font-light">
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </p>
    </div>

    {/* Links */}
    <div className="mt-4 flex justify-center space-x-6">
      <a
        href="/terms"
        className="text-gray-400 hover:text-white transition duration-200 text-xs"
      >
        Terms of Service
      </a>
      <a
        href="/privacy"
        className="text-gray-400 hover:text-white transition duration-200 text-xs"
      >
        Privacy Policy
      </a>
      <a
        href="/contact"
        className="text-gray-400 hover:text-white transition duration-200 text-xs"
      >
        Contact Us
      </a>
    </div>

    {/* Decorative Line */}
    <div className="mt-4 mx-auto h-0.5 w-20 bg-gradient-to-r from-gray-700 via-white to-gray-700"></div>
  </div>
</footer>


      </div>
    </Router>
  );
};

export default App;
