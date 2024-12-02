import React, { useState } from "react";
import axios from "axios";
import Unsubscribe from "./Unsubscribe";

const ContactCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    inquiry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the inquiry form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await axios.post("https://tattooparlorbackend.onrender.com/api/inquiries", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage({
        type: "success",
        text: "Your inquiry has been submitted successfully!",
      });
      setFormData({
        name: "",
        phone_number: "",
        email: "",
        inquiry: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Something went wrong!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-custom"
      style={{
        backgroundImage: "url('contact4.webp')", // Replace with your image URL
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents repeating
      }}
    >
      
      <div className=" text-black shadow-lg rounded-lg p-6">
        {message && (
          <div
            className={`text-center mb-4 ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}
        <div
          className="p-6 min-h-screen flex items-center justify-center"

        >
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
              Contact Us
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-2xl text-center font-semibold text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border text-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-2xl text-center font-semibold text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-2xl text-center font-semibold text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label
                  htmlFor="inquiry"
                  className="block text-2xl text-center font-semibold text-gray-600"
                >
                  Inquiry
                </label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  value={formData.inquiry}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message or question"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition-transform transform ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-1"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Unsubscribe />

      
    </div>
    
  );
};

export default ContactCenter;
