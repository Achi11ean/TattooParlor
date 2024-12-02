import { useState } from "react";

const Services = () => {
  const [activeTab, setActiveTab] = useState("customTattoos");

  const services = {
    customTattoos: {
      title: "Custom Tattoos",
      description:
        "Bring your vision to life with personalized designs. Work with our expert tattoo artists to create something truly unique.",
      image: "/custom1.webp",
    },
    customPiercings: {
      title: "Custom Piercings",
      description:
        "Precision piercings for your perfect look. Our experienced staff ensures safety and style.",
      image: "piercing1.webp",
    },
    tattooAftercare: {
      title: "Tattoo Aftercare",
      description:
        "Expert advice and products for tattoo care. Keep your ink vibrant and your skin healthy.",
      image: "aftercare1.webp",
    },
  };

  return (
    <section
    className="relative py-20 text-white overflow-hidden"
    style={{
      background: "linear-gradient(to bottom, #8B0000, #000000)", // Blood red to black gradient
      height: "1000px", // Adjust height as needed
    }}
  >
      {/* Falling Skulls and Gravestones */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="falling-object"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          >
            <span className="text-4xl opacity-70">
              {Math.random() > 0.5 ? "💀" : "🪦"}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full mx-auto px-8 relative z-10">
        <h2 
style={{ fontFamily: "'Playfair Display', serif" }}

        className="text-6xl  ont-bold mb-10 text-center">Our Services</h2>

        {/* Image Tabs */}
        <div className="flex justify-center gap-6 mb-12">
          {Object.keys(services).map((key) => (
            <button
            style={{ fontFamily: "'Playfair Display', serif" }}

              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative rounded-lg overflow-hidden  shadow-lg transition-transform transform hover:scale-110 ${
                activeTab === key ? "ring-8 ring-blue-500" : "ring-4 ring-gray-400"
              }`}
            >
              <img
                src={services[key].image}
                alt={services[key].title}
                className="w-64 h-64 object-cover"
              />
              <span
                className={`absolute inset-0 bg-black bg-opacity-60 text-white flex items-center  justify-center text-2xl font-bold transition-opacity ${
                  activeTab === key ? "opacity-100" : "opacity-0"
                }`}
              >
                {services[key].title}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-center">
          {activeTab === "customTattoos" && (
                                    <div className="max-w-4xl mx-auto text-left" style={{ maxHeight: '450px', overflowY: 'auto' }}> 
              <h3
              style={{ fontFamily: "'Playfair Display', serif" }}

              className="text-6xl font-semibold mb-6 underline ">
                Tattoos: Tailored to You
              </h3>
              <p
              style={{ fontFamily: "'Playfair Display', serif" }}

              className="text-gray-100  text-3xl mb-6">
                Our tattoo artists specialize in creating custom designs that
                reflect your personality and vision. <br/> Whether you want a minimal
                design, a bold statement piece, or a cover-up, we work closely
                with you to bring your ideas to life.
              </p>
              <ul 
              style={{ fontFamily: "'Playfair Display', serif" }}

              className="list-disc list-inside text-gray-300 text-3xl">
                <li>Minimalist line work</li>
                <li>Black-and-gray realism</li>
                <li>Colorful illustrative pieces</li>
                <li>Custom lettering and calligraphy</li>
              </ul>
            </div>
          )}

          {activeTab === "customPiercings" && (
                        <div className="max-w-4xl mx-auto text-left" style={{ maxHeight: '450px', overflowY: 'auto' }}> 

              <h3
              style={{ fontFamily: "'Playfair Display', serif" }}

              className="text-6xl font-semibold mb-6 underline">
                Custom Piercings: Perfectly You
              </h3>
              <p className="text-gray-300 text-2xl mb-6">
                Our piercers specialize in creating a safe and stylish experience
                for all your piercing needs. <br/> From basic earlobes to complex
                cartilage work, we ensure comfort and precision.
              </p>
              <ul className="list-disc list-inside text-gray-300 text-2xl">
                <li>High-quality, sterile equipment</li>
                <li>Wide variety of jewelry options</li>
                <li>Personalized aftercare instructions</li>
                <li>Experienced and friendly staff</li>
              </ul>
            </div>
          )}

          {activeTab === "tattooAftercare" && (
            <div className="max-w-4xl mx-auto text-left" style={{ maxHeight: '450px', overflowY: 'auto' }}>              <h3 
              style={{ fontFamily: "'Playfair Display', serif" }}

              className="text-6xl font-semibold mb-6 underline">
                Tattoo Aftercare: Keep It Vibrant
              </h3>
              <p className="text-gray-300 text-3xl mb-6">
                Proper aftercare is essential to ensure your tattoo heals
                beautifully. <br/> Follow these steps for the best results:
              </p>
              <ul className="list-disc list-inside text-gray-300  text-2xl">
                <li>Leave the bandage on for at least two hours after your session.</li>
                <li>Wash gently with mild soap and lukewarm water.</li>
                <li>Pat dry with a clean towel—never rub.</li>
                <li>Apply a thin layer of recommended moisturizer or ointment.</li>
                <li>Avoid swimming, tanning, or scratching while healing.</li>
              </ul>
              <p className="text-gray-300 text-2xl mt-6">
                Have questions? Don’t hesitate to ask our team for expert advice!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
