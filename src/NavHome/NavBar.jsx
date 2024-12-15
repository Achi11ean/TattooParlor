import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaInstagram, FaFacebook } from "react-icons/fa"; // Social Media Icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userType, authToken, logout } = useAuth(); // Access auth context
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl font-extrabold text-gray-800 hover:text-gray-600 transition duration-300"
          >
            InkHaven
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/newsletters"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Newsletters
          </Link>
          <Link
            to="/artists"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Artists
          </Link>
          <Link
            to="/gallery"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Gallery
          </Link>
          <Link
            to="/bookings"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Bookings
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-500 transition duration-300"
          >
            Contact
          </Link>

          {/* Conditional Links */}
          {(userType === "admin" || userType === "artist") && (
            <Link
              to="/messages"
              className="text-gray-700 hover:text-blue-500 transition duration-300"
            >
              Messages
            </Link>
          )}
          {userType === "admin" && (
            <Link
              to="/admin-dashboard"
              className="text-gray-700 hover:text-blue-500 transition duration-300"
            >
              Admin Dashboard
            </Link>
          )}

          {authToken ? (
            <button
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-400 transition duration-300"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              className="text-gray-700 hover:text-blue-500 transition duration-300"
            >
              Sign In
            </Link>
          )}

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 text-2xl transition duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-2xl transition duration-300"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-gray-500 focus:outline-none transition duration-300"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isOpen
                    ? "M6 18L18 6M6 6l12 12" // X icon
                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 py-4 space-y-4 text-center">
          <Link to="/" className="block text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link to="/newsletters" className="block text-gray-700 hover:text-blue-500">
            Newsletters
          </Link>
          <Link to="/artists" className="block text-gray-700 hover:text-blue-500">
            Artists
          </Link>
          <Link to="/gallery" className="block text-gray-700 hover:text-blue-500">
            Gallery
          </Link>
          <Link to="/bookings" className="block text-gray-700 hover:text-blue-500">
            Bookings
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-500">
            About
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-500">
            Contact
          </Link>

          {/* Conditional Links */}
          {(userType === "admin" || userType === "artist") && (
            <Link to="/messages" className="block text-gray-700 hover:text-blue-500">
              Messages
            </Link>
          )}
          {userType === "admin" && (
            <Link to="/admin-dashboard" className="block text-gray-700 hover:text-blue-500">
              Admin Dashboard
            </Link>
          )}

          {authToken ? (
            <button
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-400"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/signin" className="block text-gray-700 hover:text-blue-500">
              Sign In
            </Link>
          )}

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://www.instagram.com/gay_coded/?igsh=cTM2ZTFyenU4NTFt&utm_source=qr#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-2xl"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
