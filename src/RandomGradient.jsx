import React from "react";

// Function to generate a random gradient
export const getRandomGradient = () => {
  const gradients = [
    "from-gray-900 via-green-800 to-black",
    "from-pink-500 via-red-500 to-black",
    "from-blue-500 via-purple-600 to-black",
    "from-green-400 via-blue-500 to-black",
    "from-orange-500 via-pink-500 to-black",
    "from-teal-500 via-cyan-600 to-black",
    "from-yellow-400 via-orange-500 to-black",
    "from-indigo-500 via-blue-700 to-black",
    "from-purple-700 via-pink-600 to-black",
    "from-red-600 via-yellow-600 to-black",
    "from-gray-800 via-gray-600 to-black",
    "from-cyan-400 via-teal-500 to-black",
    "from-lime-400 via-green-500 to-black",
    "from-rose-400 via-pink-600 to-black",
    "from-emerald-500 via-teal-600 to-black",
    "from-violet-500 via-indigo-600 to-black",
    "from-fuchsia-600 via-purple-700 to-black",
    "from-amber-400 via-yellow-500 to-black",
    "from-blue-300 via-cyan-400 to-black",
    "from-red-500 via-orange-600 to-black",
    "from-cool-gray-900 via-sky-800 to-black",
    "from-green-700 via-lime-600 to-black",
    "from-yellow-500 via-amber-600 to-black",
    "from-rose-500 via-fuchsia-700 to-black",
    "from-blue-600 via-cyan-500 to-black",
    "from-indigo-600 via-purple-700 to-black",
    "from-teal-400 via-emerald-600 to-black",
    "from-orange-600 via-red-500 to-black",
    "from-purple-800 via-violet-600 to-black",
    "from-lime-500 via-yellow-400 to-black",
    "from-fuchsia-500 via-rose-600 to-black",
    "from-amber-500 via-orange-600 to-black",
    "from-red-700 via-pink-600 to-black",
    "from-blue-400 via-indigo-600 to-black",
    "from-green-600 via-teal-500 to-black",
    "from-cyan-500 via-blue-400 to-black",
    "from-pink-400 via-purple-500 to-black",
    "from-sky-500 via-indigo-600 to-black",
    "from-gray-700 via-gray-500 to-black",
    "from-violet-600 via-fuchsia-500 to-black"
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Component to wrap a card with a random gradient
const RandomGradient = ({ children }) => {
  const gradientClass = getRandomGradient();
  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} shadow-lg rounded-3xl p-4 hover:shadow-xl transition duration-300 text-white`}
    >
      {children}
    </div>
  );
};

export default RandomGradient;
