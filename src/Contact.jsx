import React, { useState, useEffect } from "react";
import axios from "axios";
import Unsubscribe from "./Unsubscribe";
import { useNavigate } from "react-router-dom"; // NEW

const ContactCenter = () => {
  const navigate = useNavigate(); // NEW

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    inquiry: "",
    company: "" // honeypot (leave empty)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // NEW: show on load
  const MAX_INQUIRY_LENGTH = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "inquiry") {
      if (value.length <= MAX_INQUIRY_LENGTH) {
        setFormData((s) => ({ ...s, inquiry: value }));
      }
      return;
    }

    if (name === "phone_number") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      let formatted = digits;
      if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        formatted = `(${digits}`;
      }
      setFormData((s) => ({ ...s, [name]: formatted }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  // Optional: keep the ability to programmatically open on mount (already default true)
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (formData.company?.trim()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "https://tattooparlorbackend.onrender.com/api/inquiries",
        {
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          inquiry: formData.inquiry,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage({ type: "success", text: "Your inquiry has been submitted successfully!" });
      setFormData({ name: "", phone_number: "", email: "", inquiry: "", company: "" });
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
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />

      <main className="mx-auto max-w-5xl px-4 py-10 relative">
        {/* ===== On-load Modal (custom popup) ===== */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-labelledby="booking-modal-title"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black text-white shadow-2xl">
              {/* Top bar accent */}
              <div className="h-1 w-full bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626] rounded-t-2xl" />
              <div className="p-6">
                <h2 id="booking-modal-title" className="text-2xl font-bold text-center mb-2">
                  Want to Book an Appointment?
                </h2>
                <p className="text-slate-300 text-center">
                  To submit a booking request, please go to our bookings page.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/bookings")}
                    className="w-full rounded-lg px-4 py-2 font-semibold shadow-lg bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626] hover:brightness-110 transition"
                  >
                    Go to Bookings
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full rounded-lg px-4 py-2 font-semibold shadow-lg bg-white/10 hover:bg-white/15 border border-white/10 transition"
                  >
                    Continue to Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ===== End Modal ===== */}

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="mt-2 text-slate-300">
            Questions, bookings, collaborations — we’d love to hear from you.
          </p>
        </header>

        {/* Status message */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mx-auto mb-6 max-w-lg rounded-lg border px-4 py-3 text-center ${
              message.type === "success"
                ? "border-green-500 bg-green-950/50 text-green-300"
                : "border-red-500 bg-red-950/50 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form card */}
        <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl p-6">
              <h2 className="text-xl font-bold border-b border-white/10 pb-3 mb-4">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot (hidden) */}
                <div className="hidden">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    autoComplete="off"
                    tabIndex={-1}
                    className="hidden"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-slate-200">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    inputMode="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="(555) 555-5555"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry" className="block text-sm font-medium text-slate-200">
                    Inquiry
                  </label>
                  <textarea
                    id="inquiry"
                    name="inquiry"
                    required
                    value={formData.inquiry}
                    onChange={handleChange}
                    placeholder="Tell us a bit about what you need…"
                    rows={5}
                    maxLength={MAX_INQUIRY_LENGTH}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  />
                  <div className="mt-1 text-right text-xs text-slate-400">
                    {formData.inquiry.length} / {MAX_INQUIRY_LENGTH} characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg px-4 py-3 font-semibold shadow-lg transition-all ${
                    isSubmitting
                      ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626] hover:brightness-110 hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? "Submitting…" : "Submit"}
                </button>

                <p className="text-center text-xs text-slate-400">
                  By submitting, you agree to be contacted about your inquiry.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl p-6 h-full">
              <h3 className="text-lg font-semibold border-b border-white/10 pb-3 mb-4">
                Other Ways to Reach Us
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span>Email</span>
                  <a href="mailto:info@inkhaven.example" className="text-white hover:underline">
                    info@inkhaven.example
                  </a>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span>Phone</span>
                  <a href="tel:+15555555555" className="text-white hover:underline">
                    (555) 555-5555
                  </a>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span>Hours</span>
                  <span className="text-white">Mon–Sat · 10am–8pm</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <span>Address</span>
                  <span className="text-white text-right">
                    123 Ink St, Suite 7<br />Haven City, NY
                  </span>
                </li>
              </ul>
              <div className="mt-6 text-xs text-slate-400">
                Prefer not to hear from us? You can{" "}
                <span className="text-white underline">unsubscribe below</span>.
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-10">
          <Unsubscribe />
        </div>
      </main>

      {/* Bottom accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e85d04] via-[#d97706] to-[#dc2626]" />
    </div>
  );
};

export default ContactCenter;
