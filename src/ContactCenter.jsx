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
        `http://127.0.0.1:5002/api/inquiries/${inquiryId}`,
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
        const response = await axios.get("http://127.0.0.1:5002/api/inquiries", {
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
      await axios.delete(`http://127.0.0.1:5002/api/inquiries/${inquiryId}`, {
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
  className="p-6 min-h-screen"
  style={{
    backgroundImage: "url('contactcenter.webp')",
    backgroundSize: "cover", // Ensures the image covers the entire container
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents tiling
    color: "#fff",
  }}
>

      <h1 className="text-3xl font-bold mb-6 text-center">
        Contact Center
      </h1>
      <div className=" text-black shadow-lg rounded-lg p-6">
        {inquiries.length > 0 ? (
          <table className="min-w-full table-auto border-collapse rounded-2xl shadow-lg overflow-hidden">
  <thead>
    <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <th className="border px-4 py-2">Name</th>
      <th className="border px-4 py-2">Phone Number</th>
      <th className="border px-4 py-2">Email</th>
      <th className="border px-4 py-2">Inquiry</th>
      <th className="border px-4 py-2">Submitted At</th>
      <th className="border px-4 py-2">Status</th>
      <th className="border px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {inquiries.map((inquiry, index) => (
      <tr
        key={index}
        className={`${
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        } hover:bg-indigo-50`}
      >
        <td className="border px-4 py-2">{inquiry.name}</td>
        <td className="border px-4 py-2">{inquiry.phone_number}</td>
        <td className="border px-4 py-2">{inquiry.email}</td>
        <td className="border px-4 py-2">{inquiry.inquiry}</td>
        <td className="border px-4 py-2">{inquiry.submitted_at}</td>
        {/* Status Column */}
        <td className="border px-4 py-2">
          <select
            value={inquiry.status}
            onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
            className="border rounded-lg p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-md"
          >
            <option value="pending" className="bg-white text-black">Pending</option>
            <option value="contacted" className="bg-white text-black">Contacted</option>
            <option value="final_booking" className="bg-white text-black">Pending Final Booking</option>
            <option value="booked" className="bg-white text-black">Booked</option>
          </select>
        </td>
        {/* Actions Column */}
        <td className="border px-4 py-2">
          <button
            onClick={() => handleDelete(inquiry.id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        ) : (
          <p className="text-center">No inquiries found.</p>
        )}
      </div>
    </div>
  );
};

export default ContactCenter;
