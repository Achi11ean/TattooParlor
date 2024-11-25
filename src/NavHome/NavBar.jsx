import { useState } from "react";
import { useAuth } from "../AuthContext"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"; // Navigate after logging out

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userType, authToken, logout } = useAuth(); // Get userType and authToken from AuthContext
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/"); // Redirect to home or sign-in page after logging out
  };

  return (
    <nav className="bg-gradient-to-r pt-5 from-gray-800 via-gray-900 to-black text-white shadow-lg">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}

          {/* Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none transition transform hover:rotate-90"
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

          {/* Desktop Links */}
          <div className={`hidden md:flex space-x-10 text-2xl`}>
            <a
              href="/"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              Home
            </a>
            <a
              href="/artists"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              Artists
            </a>
            <a
              href="/gallery"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              Gallery
            </a>
            <a
              href="/bookings"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              Bookings
            </a>
            <a
              href="/about"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              About
            </a>
            <a
              href="/contact"
              className="hover:text-red-400 transition duration-300 transform hover:scale-110"
            >
              Contact
            </a>
            {userType === "admin" && (
              <a
                href="/admin-dashboard"
                className="hover:text-red-400 transition duration-300 transform hover:scale-110"
              >
                Admin Dashboard
              </a>
            )}
            {userType === "artist" && (
              <a
                href="/artist-dashboard"
                className="hover:text-red-400 transition duration-300 transform hover:scale-110"
              >
                Artist Dashboard
              </a>
            )}
            {authToken ? (
              <button
                onClick={handleSignOut}
                className="hover:text-red-400 transition duration-300 transform hover:scale-110"
              >
                Sign Out
              </button>
            ) : (
              <a
                href="/signin"
                className="hover:text-red-400 transition duration-300 transform hover:scale-110"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 py-4 text-center">
          <div className="space-y-2 text-2xl">
            <a
              href="/"
              className="block hover:text-red-400 transition duration-300"
            >
              Home
            </a>
            <a
              href="/artists"
              className="block hover:text-red-400 transition duration-300"
            >
              Artists
            </a>
            <a
              href="/gallery"
              className="block hover:text-red-400 transition duration-300"
            >
              Gallery
            </a>
            <a
              href="/bookings"
              className="block hover:text-red-400 transition duration-300"
            >
              Bookings
            </a>
            <a
              href="/about"
              className="block hover:text-red-400 transition duration-300"
            >
              About
            </a>
            <a
              href="/contact"
              className="block hover:text-red-400 transition duration-300"
            >
              Contact
            </a>
            {userType === "admin" && (
              <a
                href="/admin-dashboard"
                className="block hover:text-red-400 transition duration-300"
              >
                Admin Dashboard
              </a>
            )}
            {userType === "artist" && (
              <a
                href="/artist-dashboard"
                className="block hover:text-red-400 transition duration-300"
              >
                Artist Dashboard
              </a>
            )}
            {authToken ? (
              <button
                onClick={handleSignOut}
                className="block hover:text-red-400 transition duration-300"
              >
                Sign Out
              </button>
            ) : (
              <a
                href="/signin"
                className="block hover:text-red-400 transition duration-300"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
