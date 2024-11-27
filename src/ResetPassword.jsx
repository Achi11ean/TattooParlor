import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5002/api/reset-password', {
        token,
        new_password: password,
      });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/signin'), 3000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
<div
  className="min-h-screen  flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('reset2.webp')", // Replace with your image URL
    backgroundSize: "contain", // Ensures the image fits within the container
    backgroundRepeat: "no-repeat", // Prevents the image from repeating
    backgroundPosition: "center", // Centers the image within the container
  }}
>
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-4xl font-bold text-center text-white">Reset Your Password</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 p-3 block w-full bg-gray-800 border border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
