
import { useEffect, useState } from 'react';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import '../../styles/candidate/candidateDashboard.css'
import { bookSlot, getAvailableSlots } from '../../services/candidateService';



export default function CandidateDashboard() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasBooked, setHasBooked] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    setCandidateEmail(email || '');
    fetchSlots();
  }, []);


  const fetchSlots = async () => {
    try {
      const response = await getAvailableSlots();
      console.log(response)
      if (response) {
        setSlots(response);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setError('Failed to load slots');
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
  setError("");
  setSuccess("");

  if (hasBooked) {
    setError(
      "You have already booked a slot. Only one booking per candidate is allowed."
    );
    return;
  }

  setIsBooking(true);

  try {
   
    await bookSlot(slot.id);

    setHasBooked(true);

    setSuccess(
      `Slot booked successfully for ${slot.slot_date} from ${slot.start_time} to ${slot.end_time}`
    );

     setSlots(
        slots.map((s) =>
          s.id === slot.id
            ? { ...s, isBooked: true, bookedBy: candidateEmail }
            : s
        )
      );

    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);

  } catch (err) {
    setError(
      err?.response?.data?.message || "Failed to book slot"
    );
  } finally {
    setIsBooking(false);
  }
};


  const availableSlots = slots.filter((s) => !s.isBooked);
  const bookedSlots = slots.filter((s) => s.isBooked);

  return (
    <>
      <Navbar role="candidate" />
      <div className="booking-page">
        <div className="booking-container">
          <header className="booking-header">
            <h1 className="booking-title">Available Interview Slots</h1>
            <p className="booking-subtitle">Select and book an available interview slot below</p>
          </header>


          {error && (
            <div className="alert-error flex items-center gap-3 mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success flex items-start gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">Booking Confirmed!</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          {hasBooked && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700 font-medium">
                You have already booked a slot. Additional bookings are disabled.
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="loading-spinner h-8 w-8 border-2 border-slate-200 border-b-slate-900 rounded-full animate-spin inline-block"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading interview schedule...</p>
            </div>
          ) : (
            <div className="space-y-12">

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Available Slots</h2>
                <div className="slot-grid">
                  {availableSlots.map((slot) => (
                    <div key={slot.id} className="slot-card slot-card-available">
                      <div className="flex justify-between items-start mb-6">
                        <div className="slot-info-group mb-0">
                          <Calendar className="slot-icon-blue" />
                          <div>
                            <p className="slot-label">Date</p>
                            <p className="slot-value">{new Date(slot.slot_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="status-badge badge-available">Available</span>
                      </div>

                      <div className="slot-info-group mb-8">
                        <Clock className="slot-icon-blue" />
                        <div>
                          <p className="slot-label">Time Window</p>
                          <p className="slot-value">{slot.start_time} - {slot.end_time}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookSlot(slot)}
                        disabled={isBooking || hasBooked}
                        className="btn-book"
                      >
                        {isBooking ? 'Processing...' : 'Book This Slot'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>


              {bookedSlots.length > 0 && (
                <section className="pt-10 border-t border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Currently Booked</h2>
                  <div className="slot-grid">
                    {bookedSlots.map((slot) => (
                      <div key={slot.id} className="slot-card slot-card-booked">
                        <div className="flex justify-between items-start mb-4">
                          <div className="slot-info-group mb-0">
                            <Calendar className="slot-icon-muted" />
                            <p className="slot-value">{new Date(slot.slot_date).toLocaleDateString()}</p>
                          </div>
                          <span className="status-badge badge-booked">Full</span>
                        </div>
                        <div className="slot-info-group mb-6">
                          <Clock className="slot-icon-muted" />
                          <p className="slot-value">{slot.start_time} - {slot.end_time}</p>
                        </div>
                        <button className="btn-booked-status" disabled>Booked</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
