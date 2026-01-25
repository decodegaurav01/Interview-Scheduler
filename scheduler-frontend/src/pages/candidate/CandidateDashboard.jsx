
import { useEffect, useState } from 'react';
import { Calendar, Clock, Check, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import '../../styles/candidate/candidateDashboard.css'
import { bookSlot, getCandidateDashboard } from '../../services/candidateService';
import StatusAlert from '../../components/StatusAlert';



export default function CandidateDashboard() {
  const [hasBooked, setHasBooked] = useState(false);
  const [booking, setBooking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getCandidateDashboard();
      if (data.hasBooked) {
        setHasBooked(true);

        setBooking(data.booking);
      } else if (data.availableSlots.length === 0) {
        setError("The slots are not available at this time.")
      } else {
        setHasBooked(false);
        const now = new Date();
        const futureSlots = data.availableSlots.filter(slot => {
          const slotDate = new Date(slot.slot_date);
          const [startHour, startMinute] = slot.start_time.split(':');
          slotDate.setHours(startHour, startMinute, 0, 0);
          return slotDate >= now;
        });
        setSlots(futureSlots);
        if (futureSlots.length === 0) {
          setError("All available slots have passed.");
        }
      }
    } catch (err) {
      console.log(err)
      setError("Failed to load candidate dashboard");
    } finally {
      setIsLoading(false);
    }
  };


  const handleBookSlot = async (slotId) => {
    setError("");
    setSuccess("");
    setIsBooking(true);

    try {
      await bookSlot(slotId);

      setSuccess("Slot booked successfully");

      await loadDashboard();

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

  return (
    <>
      <Navbar role="candidate" />
      <div className="booking-page">
        <div className="booking-container">
          <header className="booking-header">
            <h1 className="booking-title">Interview Scheduler</h1>
            <p className="booking-subtitle"> Book your interview slot</p>
          </header>

          <StatusAlert
            error={error}
            success={success}
            reset={() => { setError(''); setSuccess(''); }}
          />

          {!isLoading && hasBooked && booking && (
            <section className="booking-confirmation">
              <div className="confirmation-card-body">
                <div>
                  <span className="status-indicator status-online mb-4">
                    Confirmed Booking
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Your Interview is Set
                  </h2>
                  <p className="text-blue-100 mb-6 max-w-md">
                    We've reserved this time for you. Please ensure you are available 15 minutes before the start time.
                  </p>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold">Date</p>
                        <p className="font-semibold">{new Date(booking.slot_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold">Time Window</p>
                        <p className="font-semibold">{booking.start_time} - {booking.end_time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <CheckCircle className="w-12 h-12 text-green-300 mb-3" />
                  <p className="text-xs text-blue-100 italic">
                    Booked on {new Date(booking.booked_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </section>
          )}

          {!isLoading && !hasBooked && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Available Time Slots</h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {slots.length} Slots Open
                </span>
              </div>

              <div className="slot-grid">
                {slots.map((slot) => (


                  <div key={slot.id} className="slot-card slot-card-available group">
                    <div className="slot-info-group">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        <Calendar className="slot-icon-blue" />
                      </div>
                      <div>
                        <p className="slot-label">Date</p>
                        <p className="slot-value">{new Date(slot.slot_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="slot-info-group mb-8">
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        <Clock className="slot-icon-blue" />
                      </div>
                      <div>
                        <p className="slot-label">Time Slot</p>
                        <p className="slot-value">{slot.start_time} - {slot.end_time}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookSlot(slot.id)}
                      disabled={isBooking}
                      className="btn-book flex items-center justify-center gap-2 group"
                    >
                      <span>{isBooking ? "Confirming..." : "Book Slot"}</span>
                      {!isBooking && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
