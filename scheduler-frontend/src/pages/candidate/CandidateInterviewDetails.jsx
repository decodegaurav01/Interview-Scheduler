import { useEffect, useState } from "react";
import { Calendar, Clock, User, Mail, Link2, Coffee, Video } from "lucide-react";
import { getInterviewDetails } from "../../services/candidateService";
import { Navbar } from "../../components/Navbar";
import '../../styles/candidate/CandidateInterviewDetails.css'

export default function CandidateInterviewDetails() {
  const [interview, setInterview] = useState(null);
  const [hasInterview, setHasInterview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getRelativeTime = (dateString) => {
    const today = new Date();
    const interviewDate = new Date(dateString);
    const diffTime = interviewDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Completed";
    return `In ${diffDays} days`;
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const data = await getInterviewDetails();
      console.log(data)
      setHasInterview(data.hasInterview);
      setInterview(data.interview || null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <>
      <Navbar role="candidate" />

      <div className="candidate-page">
        <div className="candidate-page-container">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-200">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading details...</p>
            </div>
          ) : !hasInterview ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Coffee className="w-8 h-8" />
              </div>
              <p className="text-lg text-gray-500">No interviews scheduled yet.</p>
            </div>
          ) : (
            <div className="candidate-interview-card">
              {/* Header Section */}
              <div className="card-header">
                <h1 className="card-title">Interview Scheduled</h1>
                <p className="relative-time">
                  {getRelativeTime(interview.slot_date)}
                </p>
              </div>

              {/* Grid Section */}
              <div className="info-grid">
                
                {/* 1. Date */}
                <div className="info-block">
                  <div className="icon-square">
                    <Calendar className="icon-svg" />
                  </div>
                  <div className="block-content">
                    <span className="block-label">Date</span>
                    <span className="block-value">
                      {new Date(interview.slot_date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                      })}
                    </span>
                    <span className="block-subtext">
                      {new Date(interview.slot_date).toLocaleDateString(undefined, { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {/* 2. Time */}
                <div className="info-block">
                  <div className="icon-square">
                    <Clock className="icon-svg" />
                  </div>
                  <div className="block-content">
                    <span className="block-label">Time</span>
                    <span className="block-value">
                      {interview.start_time} – {interview.end_time}
                    </span>
                    <span className="block-subtext">Standard Time</span>
                  </div>
                </div>

                {/* 3. Interviewer (Replaces "Format") */}
                <div className="info-block">
                  <div className="icon-square">
                    <User className="icon-svg" />
                  </div>
                  <div className="block-content">
                    <span className="block-label">Interviewer</span>
                    <span className="block-value">
                      {interview.interviewer_name || "Assigned Team"}
                    </span>
                    <span className="block-subtext">
                      {interview.interviewer_role || "Hiring Manager"}
                    </span>
                  </div>
                </div>

                {/* 4. Meeting Link (Styled like the blue card in image) */}
                <div className="col-span-1">
                  {interview.meeting_link ? (
                    <a 
                      href={interview.meeting_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="meeting-link-card group"
                    >
                      <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                          Meeting Link
                        </span>
                        <span className="meeting-link-text group-hover:underline">
                          Join Google Meet
                        </span>
                      </div>
                    </a>
                  ) : (
                     /* Fallback if no link yet */
                    <div className="info-block opacity-50">
                      <div className="icon-square bg-gray-100 text-gray-400">
                        <Video className="icon-svg" />
                      </div>
                      <div className="block-content">
                        <span className="block-label">Meeting Link</span>
                        <span className="block-value text-gray-400 text-base">Pending</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
