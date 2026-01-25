import { useState } from "react";
import { X, Link as LinkIcon, User, CheckCircle, Mail } from "lucide-react";

export default function AssignInterviewerModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  interview,
  isLoading 
}) {
  const [name, setName] = useState(interview?.interviewer_name || "");
  const [email, setEmail] = useState(interview?.email || "");
  const [link, setLink] = useState(interview?.meeting_link || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(interview.booking_id, { interviewerName: name,interviewerEmail: email, meetingLink: link });
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
  
  <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
    
    {/* Header */}
    <div className="flex items-center justify-between p-5 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">
        Assign Interviewer
      </h3>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Body */}
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      
      {/* Interviewer Name Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Interviewer Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="interviewer name"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder-slate-400"
            required
          />
        </div>

        {/* Interviewer Email Input */}
        <label className="text-sm font-medium text-slate-700 block mt-3">
          Interviewer Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder-slate-400"
            required
          />
        </div>
      </div>

      {/* Meeting Link Input */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Meeting Link (Google Meet/Zoom/Teams)
        </label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://meet.google.com/..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder-slate-400"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Save Details
            </>
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );
}