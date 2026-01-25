import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Calendar, Clock, Search, Trash2, Users, CalendarCheck, BookIcon, BookOpen, LayoutDashboard, CheckCircle, CalendarIcon, Lock } from 'lucide-react';
import '../../styles/admin/AdminDashboard.css';
import { cancelBooking, getAllInterviewBookings, getDashboardMetrics } from '../../services/adminService';
import { StatCard } from '../../components/StatCard';
import StatusAlert from '../../components/StatusAlert';
import DeleteModal from '../../components/DeleteModal';
import { DashboardCard } from '../../components/DashboardCard';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [metrics, setMetrics] = useState(null);



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getAllInterviewBookings();

      setBookings(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedBookingId(id);
    setShowDeleteModal(true);
  };

  const handleCancelBooking = async () => {
    setIsDeleting(true);
    const originalBookings = [...bookings];
    try {
      await cancelBooking(selectedBookingId);
      setSuccess("Booking cancelled successfully");
      setBookings(prev => prev.filter(b => b.id !== selectedBookingId));
      setShowDeleteModal(false);

    } catch (err) {
      console.log(err)
      setBookings(originalBookings);
      setError("Failed to cancel booking. Please try again.");

    } finally {
      setShowDeleteModal(false);
      setSelectedBookingId(null);
    }
  };


  const filteredBookings = bookings.filter(b =>
    b.candidate_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(b.date).toLocaleDateString().includes(searchQuery)
  );


  const stats = {
    total: bookings.length,
    uniqueCandidates: new Set(bookings.map((b) => b.candidate_email)).size,
    upcoming: bookings.filter((b) => new Date(b.date) > new Date()).length
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar role="admin" />

      <div className="dashboard-overview-wrapper">
        <div className="dashboard-overview-container">

          <header className="overview-header">
            <div>
              <h1 className="overview-title">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Manage your interview schedules and talent pipeline.</p>
            </div>
          </header>

          <StatusAlert
            error={error}
            success={success}
            reset={() => { setError(''); setSuccess(''); }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <DashboardCard 
              title="Total Slots" 
              value={metrics?.total_slots || 0} 
              icon={LayoutDashboard}
              color="text-slate-600"
              bg="bg-slate-50"
            />
            <DashboardCard 
              title="Available" 
              value={metrics?.available_slots || 0} 
              icon={CheckCircle}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <DashboardCard 
              title="Booked" 
              value={metrics?.booked_slots || 0} 
              icon={CalendarIcon}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <DashboardCard 
              title="Frozen/Inactive" 
              value={metrics?.frozen_slots || 0} 
              icon={Lock}
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <DashboardCard 
              title="Total Bookings" 
              value={metrics?.total_bookings || 0} 
              icon={Users}
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
          </div>

          <div className="overview-card">
            <div className="overview-card-header">
              <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
              <div className='flex items-center gap-4 w-full sm:w-auto'>
                <div className="search-container">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search emails or dates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="dashboard-search-input"
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {filteredBookings.length} found
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p>Loading schedule...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <p>No bookings found matching your search.</p>
              </div>
            ) : (
              
               
                <div className="overview-table-wrapper">
                  <table className="overview-table">
                    <thead className="overview-thead">
                      <tr>
                        <th className="px-6 py-4">Candidate</th>
                        <th className="px-6 py-4">Schedule</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Booked Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.map((booking) => {
                        const isPast = new Date(booking.date) < new Date();
                        return (
                          <tr key={booking.id} className="overview-tr group">
                            <td className="overview-td">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                  {booking.candidate_email.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-medium text-slate-900">{booking.candidate_email}</p>
                              </div>
                            </td>
                            <td className="overview-td">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  {booking.date}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                  <Clock className="w-3.5 h-3.5" />
                                  {booking.startTime} - {booking.endTime}
                                </div>
                              </div>
                            </td>
                            <td className="overview-td">
                              <span className={`badge ${isPast ? 'badge-completed' : 'badge-scheduled'}`}>
                                {isPast ? 'Completed' : 'Scheduled'}
                              </span>
                            </td>
                            <td className="overview-td text-slate-500">
                              {new Date(booking.booked_at).toLocaleDateString()}
                            </td>
                            <td className="overview-td text-right">
                              <button
                                onClick={() => openDeleteModal(booking.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Cancel Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              
            )}
          </div>

          {/* Dynamic Statistics Grid */}
          <div className="stats-container">
            <StatCard
              icon={BookOpen}
              label="Total Bookings"
              value={stats.total}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              icon={Users}
              label="Unique Talent"
              value={stats.uniqueCandidates}
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <StatCard
              icon={CalendarCheck}
              label="Upcoming Slots"
              value={stats.upcoming}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
          </div>
        </div>
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleCancelBooking}
          isLoading={isDeleting}
          title="Confirm Deletion"
          message="Are you sure you want to delete this email?"
          warning="This action cannot be undone."
        />
      </div>
    </>
  );
}

