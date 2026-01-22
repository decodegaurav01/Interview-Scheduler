import { Navbar } from '../../components/Navbar'
import { useEffect, useState } from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import '../../styles/admin/AdminDashboard.css'
import { getAllInterviewBookings } from '../../services/adminService';



export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await getAllInterviewBookings();
    setBookings(response);
    setIsLoading(false)
    };

    fetchBookings();
  }, []);

  return (
    
    <>
      <Navbar role="admin" />
      <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Overview of all scheduled interviews</p>

        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Interview Bookings</h2>
          </div>

          {isLoading ? (
            <div className="state-container">
              <div className="loading-spinner" />
              <p className="mt-4 text-slate-500">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="state-container">
              <Calendar className="empty-icon" />
              <p className="text-slate-500">No bookings yet. Candidates will appear here soon.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead className="table-head">
                  <tr>
                    <th className="table-th">Candidate Email</th>
                    <th className="table-th">Interview Date</th>
                    <th className="table-th">Time</th>
                    <th className="table-th">Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="table-row">
                      <td className="table-td">
                        <div className="cell-content">
                          <User className="w-4 h-4 text-slate-400" />
                          {booking.candidate_email}
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="cell-content">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(booking.slot_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="cell-content">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {booking.start_time} - {booking.end_time}
                        </div>
                      </td>
                      <td className="table-td text-slate-400">
                        {new Date(booking.booked_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-label">Total Bookings</h3>
            <p className="stat-value">{bookings.length}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Unique Candidates</h3>
            <p className="stat-value">
              {new Set(bookings.map((b) => b.candidate_email)).size}
            </p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Upcoming Interviews</h3>
            <p className="stat-value">
              {bookings.filter((b) => new Date(b.slot_date) > new Date()).length}
            </p>
          </div>
        </div>
      </div>
    </div>
   </>
  );
}
