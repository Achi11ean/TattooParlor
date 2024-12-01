import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const ContactCenter = () => {
  const { userType } = useAuth(); // Get userType directly from AuthContext
  const navigate = useNavigate();
  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await axios.patch(
        `https://tattooparlorbackend.onrender.com/api/inquiries/${inquiryId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
  
      // Update the status in the state
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (userType !== "admin" && userType !== "artist") {
        navigate("/signin"); // Redirect unauthorized users
        return;
      }
  
      try {
        const response = await axios.get("https://tattooparlorbackend.onrender.com/api/inquiries", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setInquiries(response.data.inquiries);
      } catch (err) {
        setError("Failed to fetch inquiries. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInquiries();
  }, [userType, navigate]);

  const handleDelete = async (inquiryId) => {
    try {
      await axios.delete(`https://tattooparlorbackend.onrender.com/api/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      // Remove the deleted inquiry from the state
      setInquiries((prevInquiries) => prevInquiries.filter((inquiry) => inquiry.id !== inquiryId));
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
      setError("Failed to delete the inquiry. Please try again later.");
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  return (
<div
  className="p-6 min-h-screen "
  style={{
    backgroundImage: "url('contactcenter.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#fff",
  }}
>
  <h1 className="text-3xl font-bold mb-6 text-center">Contact Center</h1>

  <div
    className="text-black shadow-lg rounded-lg p-6"
    style={{ maxHeight: "80vh", overflowY: "auto" }}
  >    {inquiries.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {inquiries.map((inquiry, index) => (
          <div
            key={index}
            className="bg-orange-200 p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow border-l-4 border-orange-500"
          >
            <h2 className="text-xl font-extrabold text-orange-700 mb-2">
              {inquiry.name}
            </h2>
            <p className="text-gray-800 mb-1">
              <strong>Phone:</strong> {inquiry.phone_number}
            </p>
            <p className="text-gray-800 mb-1">
              <strong>Email:</strong> {inquiry.email}
            </p>
            <p className="text-gray-800 mb-1">
              <strong>Inquiry:</strong> {inquiry.inquiry}
            </p>
            <p className="text-gray-800 mb-1">
              <strong>Submitted At:</strong> {inquiry.submitted_at}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status:
              </label>
              <select
                value={inquiry.status}
                onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                className="w-full border border-orange-300 rounded-lg p-2 bg-white text-gray-800 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
              >
                <option value="pending" className="bg-white text-black">
                  Pending
                </option>
                <option value="contacted" className="bg-white text-black">
                  Contacted
                </option>
                <option
                  value="final_booking"
                  className="bg-white text-black"
                >
                  Pending Final Booking
                </option>
                <option value="booked" className="bg-white text-black">
                  Booked
                </option>
              </select>
            </div>
            <button
              onClick={() => handleDelete(inquiry.id)}
              className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 transition-all"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center">No inquiries found.</p>
    )}
  </div>
</div>

  );
};

export default ContactCenter;
