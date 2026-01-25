import { useEffect, useState } from "react";
import {
  Calendar, Clock, Video, Bell, Trash2, User, RefreshCw, Search
} from 'lucide-react';
import { Navbar } from "../../components/Navbar";
import { getAllInterviews, sendReminder, cancelBooking, assignInterviewer } from "../../services/adminService";
import '../../styles/admin/AdminInterviews.css';
import StatusAlert from "../../components/StatusAlert";
import DeleteModal from "../../components/DeleteModal";
import { InterviewCard } from "../../components/InterviewCard";
import AssignInterviewerModal from "../../components/AssignInterviewerModal";

export default function AdminInterviewBookings() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [reminderLoadingId, setReminderLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => { fetchInterviews(); }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredInterviews(interviews);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredInterviews(interviews.filter(i =>
        i.candidate_email.toLowerCase().includes(lowerQuery) ||
        (i.interviewer_name && i.interviewer_name.toLowerCase().includes(lowerQuery))
      ));
    }
  }, [searchQuery, interviews]);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllInterviews();
      // const safeData = Array.isArray(data) ? data : [];
      
      setInterviews(data);
      setFilteredInterviews(data);
    } catch (err) {
      console.log(err)
      setError("Failed to load interview schedule.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminder = async (bookingId) => {
    setReminderLoadingId(bookingId);
    try {
      await sendReminder(bookingId);
      setSuccess("Reminder sent successfully.");
    } catch (err) {
      console.log(err);
      setError("Failed to send reminder.");
    } finally {
      setReminderLoadingId(null);
    }
  };

  const confirmCancel = (id) => {
    setSelectedBookingId(id);
    setDeleteModalOpen(true);
  };

  const handleCancel = async () => {
    setIsDeleting(true);
    try {
      await cancelBooking(selectedBookingId);
      setSuccess("Interview cancelled.");
      setInterviews(prev => prev.filter(i => i.booking_id !== selectedBookingId));
      setDeleteModalOpen(false);
    } catch (err) {
      console.log(err)
      setError("Failed to cancel interview.");
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const openAssignModal = (interview) => {
    
    setSelectedInterview(interview);
    setAssignModalOpen(true);
  };


  const handleAssignSubmit = async (bookingId, data) => {
    setIsAssigning(true);
    try {

      await assignInterviewer(bookingId, data);

      setSuccess("Interviewer assigned successfully!");


      setInterviews(prev => prev.map(i =>
        i.booking_id === bookingId
          ? { ...i, interviewer_name: data.interviewerName, meeting_link: data.meetingLink }
          : i
      ));

      setAssignModalOpen(false);
    } catch (err) {
      console.log(err);
      setError("Failed to assign interviewer.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Navbar role="admin" />

      <div className="page-wrapper">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="page-title">Interview Bookings</h1>
              <p className="page-subtitle">Manage upcoming sessions.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="search-wrapper">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search interview..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={fetchInterviews} className="refresh-btn">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <StatusAlert error={error} success={success} reset={() => { setError(''); setSuccess(''); }} />

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          )}


          {!isLoading && filteredInterviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 interview-card border-dashed">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No interviews found</p>
            </div>
          )}


          {!isLoading &&Array.isArray(filteredInterviews)&& filteredInterviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterviews.map((i) => (
                <InterviewCard
                  key={i.booking_id}
                  interview={i}
                  onAssign={() => openAssignModal(i)}
                  onRemind={() => handleReminder(i.booking_id)}
                  onCancel={confirmCancel}
                  loadingId={reminderLoadingId}
                />
              ))}
            </div>
          )}
        </div>
          
        <AssignInterviewerModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onConfirm={handleAssignSubmit}
          interview={selectedInterview}
          isLoading={isAssigning}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleCancel}
          isLoading={isDeleting}
          title="Cancel Interview"
          message="Are you sure you want to cancel this interview?"
          warning="This cannot be undone."
        />
      </div>
    </>
  );
}

