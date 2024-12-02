import React, { useState } from "react";
import Subscribe from "../Subscribe";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ink Haven</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`hover:text-gray-300 ${
                    activeTab === "about" ? "text-red-500 font-bold" : ""
                  }`}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("artists")}
                  className={`hover:text-gray-300 ${
                    activeTab === "artists" ? "text-red-500 font-bold" : ""
                  }`}
                >
                  Artists
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`hover:text-gray-300 ${
                    activeTab === "gallery" ? "text-red-500 font-bold" : ""
                  }`}
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`hover:text-gray-300 ${
                    activeTab === "services" ? "text-red-500 font-bold" : ""
                  }`}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`hover:text-gray-300 ${
                    activeTab === "contact" ? "text-red-500 font-bold" : ""
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Tabs Content */}
      <div className="container mx-auto p-6">
        {activeTab === "about" && (
          <section id="about">
            <h3 className="text-3xl font-bold mb-4">About Us</h3>
            <p className="text-lg text-gray-600">
              At Ink Haven, we believe in creating stories through art. With a
              team of highly skilled artists, we bring your visions to life
              with precision and passion.
            </p>
          </section>
        )}
        {activeTab === "artists" && (
          <section id="artists">
            <h3 className="text-3xl font-bold mb-8">Our Featured Artists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Example Artist */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <img
                  src="/path-to-artist-image.jpg"
                  alt="Artist"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold">Artist Name</h4>
                <p className="text-gray-600">Specialty: Traditional, Realism</p>
              </div>
              {/* Add more artist cards */}
            </div>
          </section>
        )}
        {activeTab === "gallery" && (
          <section id="gallery">
            <h3 className="text-3xl font-bold mb-8">Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Example Image */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <img
                  src="/path-to-gallery-image.jpg"
                  alt="Tattoo Art"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              {/* Add more gallery images */}
            </div>
          </section>
        )}
        {activeTab === "services" && (
          <section id="services">
            <h3 className="text-3xl font-bold mb-4">Our Services</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Custom Tattoo Designs</li>
              <li>Piercings</li>
              <li>Tattoo Cover-Ups</li>
              <li>Aftercare Guidance</li>
            </ul>
          </section>
        )}
        {activeTab === "contact" && (
          <section id="contact">
            <h3 className="text-3xl font-bold mb-4">Contact Us</h3>
            <p className="text-lg text-gray-600">123 Tattoo Lane, Art City, CA 90210</p>
            <p className="text-lg text-gray-600">Email: info@inkhaven.com</p>
            <p className="text-lg text-gray-600">Phone: (123) 456-7890</p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Ink Haven. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
