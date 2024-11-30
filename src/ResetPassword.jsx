import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'At least one uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
    { label: 'At least one digit (0-9)', test: (pw) => /\d/.test(pw) },
    { label: 'At least one special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    // Ensure all requirements are met
    const isPasswordValid = passwordRequirements.every((req) => req.test(password));
    if (!isPasswordValid) {
      setError('Password does not meet the requirements.');
      return;
    }

    try {
      const response = await axios.post('https://tattooparlorbackend.onrender.com/api/reset-password', {
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
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('reset2.webp')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-4xl font-bold text-center text-white">Reset Your Password</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-3 block w-full bg-gray-800 border border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-300"
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
                    className={req.test(password) ? 'text-green-500' : 'text-gray-400'}
                  >
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 ${
                passwordRequirements.every((req) => req.test(password))
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white font-bold rounded-lg transition`}
              disabled={!passwordRequirements.every((req) => req.test(password))}
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
