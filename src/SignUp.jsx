import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
    
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "artist", // Default user type
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRequirements = [
    { label: "At least 6 characters", test: (pw) => pw.length >= 8 },
    { label: "No more than 20 characters", test: (pw) => pw.length <= 128 },
    { label: "At least one uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
    { label: "At least one lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
    { label: "At least one digit (0-9)", test: (pw) => /\d/.test(pw) },
    { label: "At least one special character (!@#$%^&*)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    console.log("Submitting form with data:", formData);
  
    const passwordValid = passwordRequirements.every((req) => req.test(formData.password));
    console.log("Password valid:", passwordValid);
  
    if (!passwordValid) {
      setError("Password does not meet the requirements.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const { username, email, password, userType } = formData;
      console.log("Sending data to API:", { username, email, password, userType });
  
      const response = await axios.post("http://127.0.0.1:5002/api/signup", {
        username,
        email,
        password,
        user_type: userType, // Send as "user_type"
    });
  
      console.log("API response:", response.data);
  
      setSuccess(response.data.message);
      setTimeout(() => navigate("/signin"), 200); // Add a slight delay to show success message

      setFormData({ username: "", email: "", password: "", confirmPassword: "", userType: "artist" });
    } catch (err) {
      console.error("Error during sign-up:", err);
  
      if (err.response) {
        console.error("Server responded with error:", err.response.data);
        setError(err.response.data.error || "An error occurred during sign-up. Please try again.");
      } else {
        console.error("No response from server. Possible network error.");
        setError("An error occurred during sign-up. Please check your network and try again.");
      }
    }
  };
  

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('signup2.webp')", // Replace with your image URL
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-sm text-gray-400 hover:text-red-500 mt-2"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <p className="text-sm font-medium text-gray-300 mb-2">Password must include:</p>
            <ul className="list-disc pl-5 text-sm text-gray-300">
              {passwordRequirements.map((req, index) => (
                <li
                  key={index}
                  className={req.test(formData.password) ? "text-green-500" : "text-gray-400"}
                >
                  {req.label}
                </li>
              ))}
            </ul>
          </div>

          {/* User Type */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-1">
              User Type
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
            >
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
