import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const BookingCalendar = ({ artistId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch bookings for the given artistId
  const BookingCalendar = ({ bookings }) => {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      const formattedEvents = bookings.map((booking) => ({
        id: booking.id,
        title: booking.name || "Booking",
        start: new Date(booking.appointment_date),
        end: new Date(booking.appointment_date),
        type: booking.tattoo_style || "Tattoo Booking",
      }));
      setEvents(formattedEvents);
    }, [bookings]);
  
    // Rest of BookingCalendar code...
  };
  

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const EventDetailsModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Booking Details</h3>
        <p className="mb-2">
          <strong>Title:</strong> {selectedEvent?.title}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {selectedEvent?.start.toLocaleString()}
        </p>
        <p className="mb-2">
          <strong>Type:</strong> {selectedEvent?.type}
        </p>
        <button
          onClick={() => setShowDetails(false)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Artist's Bookings
      </h2>
      <div className="bg-white my-custom-calendar p-6 rounded-lg shadow-xl max-w-screen-md mx-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{
            height: "500px",
            width: "100%",
            borderRadius: "12px",
          }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#3b82f6", // Tailwind's Blue-500
              color: "#ffffff",
              borderRadius: "5px",
              padding: "5px",
              border: "1px solid #2563eb", // Tailwind's Blue-700
            },
          })}
          onSelectEvent={handleSelectEvent}
          components={{
            toolbar: (props) => (
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => props.onNavigate("PREV")}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-md hover:opacity-90"
                >
                  Previous
                </button>
                <h3 className="text-lg font-bold text-gray-800">{props.label}</h3>
                <button
                  onClick={() => props.onNavigate("NEXT")}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-md hover:opacity-90"
                >
                  Next
                </button>
              </div>
            ),
          }}
        />
        {showDetails && <EventDetailsModal />}
      </div>
    </div>
  );
};

export default BookingCalendar;
