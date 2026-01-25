import { Bell, Clock, Trash2, User, Video } from "lucide-react";

export function InterviewCard({ interview, onRemind, onCancel, onAssign, loadingId }) {
  const isPast = new Date(interview.slot_date) < new Date();
  const hasInterviewer = interview.interviewer_name;

  return (
    <div className="interview-card group">
      
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="date-badge">
            <div className="text-xs uppercase tracking-wide">
              {new Date(interview.slot_date).toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-lg leading-none">
              {new Date(interview.slot_date).getDate()}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-slate-500" />
              <div className="text-blue-800">
                {interview.start_time} - {interview.end_time}
                </div>
            </div>
            <span className={`status-badge ${isPast ? 'status-completed' : 'status-scheduled'}`}>
              {isPast ? 'Completed' : 'Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="info-row">
          <div className="icon-circle">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="info-label">Candidate</p>
            <p className="info-value" title={interview.candidate_email}>
              {interview.candidate_email}
            </p>
          </div>
        </div>

        <div className="info-row">
          <div className={`icon-circle ${hasInterviewer ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : ''}`}>
            <Video className="w-4 h-4" />
          </div>
          <div className="flex-1">
             <div className="flex items-center justify-between">
               <p className="info-label">Interviewer</p>
               
               {/* ASSIGN / EDIT BUTTON */}
               <button 
                 onClick={onAssign}
                 className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 uppercase tracking-wide transition-colors"
               >
                 {hasInterviewer ? 'Edit' : '+ Assign'}
               </button>
             </div>
             
             <p className="info-value text-slate-700 dark:text-slate-300">
               {interview.interviewer_name || <span className="text-slate-400 italic text-xs">Pending Assignment</span>}
             </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        {interview.meeting_link ? (
          <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="btn-join">
            <Video className="w-3.5 h-3.5" />
            Join
          </a>
        ) : (
          <button disabled className="btn-disabled text-xs">Link Pending</button>
        )}

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onRemind(interview.booking_id)}
            disabled={loadingId === interview.booking_id}
            className="btn-icon btn-icon-primary"
            title="Send Reminder"
          >
            <Bell className={`w-4 h-4 ${loadingId === interview.booking_id ? 'animate-pulse text-indigo-600' : ''}`} />
          </button>
          <button 
            onClick={() => onCancel(interview.booking_id)}
            className="btn-icon btn-icon-danger"
            title="Cancel Booking"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}