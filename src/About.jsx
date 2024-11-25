import React from "react";

const About = () => {
  return (
    <div>
      <div
        className="h-64 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 text-white"
        style={{
          backgroundImage: "url('/about.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
<div className="h-full flex items-center justify-center">
  <h1 className="text-6xl font-bold text-white hover:text-pink-300 hover:scale-105 transition-transform duration-300 shadow-2xl">
    About Us
  </h1>
</div>

      </div>
      <div
        className="p-6 min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 text-white"
      >
<div className="max-w-4xl mx-auto p-10 bg-gradient-to-br from-gray-800 via-gray-900 to-black bg-opacity-90 rounded-xl shadow-2xl">
  <div className="text-center mb-8">
    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
      Welcome to <span className="underline decoration-wavy decoration-blue-500">Ink Haven</span>
    </h1>
    <p className="mt-4 text-lg text-gray-300">
      Where creativity meets craftsmanship. Discover art that lasts a lifetime.
    </p>
  </div>
  <div className="space-y-6 text-gray-300 leading-relaxed">
    <p className="text-lg">
      At <strong className="text-white">Ink Haven</strong>, we bring your vision to life with passion and precision. Whether you're looking for a bold statement piece or a subtle design, our team of skilled artists is here to create lasting art that reflects your personality.
    </p>
    <p className="text-lg">
      With state-of-the-art tools and adherence to the highest hygiene standards, we ensure your experience is as safe and comfortable as it is inspiring.
    </p>
    <p className="text-lg">
      Every tattoo tells a story. Let <strong className="text-white">Your Business Name</strong> help you tell yours.
    </p>
  </div>
  <div className="mt-10 text-center">
    <img
      src="https://media.istockphoto.com/id/1368965646/photo/multi-ethnic-guys-and-girls-taking-selfie-outdoors-with-backlight-happy-life-style-friendship.jpg?s=612x612&w=0&k=20&c=qYST1TAGoQGV_QnB_vMd4E8jdaQUUo95Sa2JaKSl_-4="
      alt="Our Team"
      className="rounded-xl shadow-lg mx-auto w-72 hover:scale-105 transition-transform duration-300"
    />
    <p className="mt-4 text-gray-400 italic">Our talented team of artists, ready to create your masterpiece.</p>
  </div>
  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="p-8 bg-gradient-to-b from-purple-800 via-purple-900 to-black rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">
        Our Mission
      </h2>
      <p className="mt-4 text-gray-300">
        To inspire and empower our clients by turning ideas into stunning, one-of-a-kind tattoos.
      </p>
    </div>
    <div className="p-8 bg-gradient-to-b from-purple-800 via-purple-900 to-black rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-500">
        Our Vision
      </h2>
      <p className="mt-4 text-gray-300">
        To be recognized as the leading destination for creative and meaningful tattoo art.
      </p>
    </div>
    <div className="p-8 bg-gradient-to-b from-purple-800 via-purple-900 to-black rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
        Our Values
      </h2>
      <p className="mt-4 text-gray-300">
        Creativity, inclusivity, professionalism, and an unwavering dedication to client satisfaction.
      </p>
    </div>
  </div>
  <div className="mt-12 text-center">
    <button
      onClick={() => (window.location.href = "/contact")}
      className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-8 py-4 text-xl font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-300"
    >
      Get in Touch
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default About;
