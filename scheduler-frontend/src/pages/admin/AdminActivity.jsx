
import { useEffect, useState } from "react";
import { getAdminActivityLogs } from "../../services/adminService";
import { Navbar } from "../../components/Navbar";
import "../../styles/DarkStyle/admin/ActivityLoger.css"

import { ShieldCheck, History, User } from "lucide-react"; //

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getAdminActivityLogs();
      setLogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionClass = (action) => {
    const act = action.toLowerCase();
    if (act.includes('create')) return 'action-create';
    if (act.includes('delete')) return 'action-delete';
    if (act.includes('update') || act.includes('edit')) return 'action-update';
    return 'action-default';
  };

  return (
    <div className="activity-page-wrapper">
      <Navbar role="admin" />

      <div className="activity-container">
        <header className="activity-header">
          <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="w-8 h-8 text-indigo-600" />
             <h1 className="activity-title">Admin Activity Logs</h1>
          </div>
          <p className="text-slate-500">Audit trail of all administrative actions performed</p>
        </header>

        <div className="activity-card">
          {isLoading ? (
            <div className="state-box">
              <div className="spinner-activity" />
              <p className="text-slate-500 font-medium">Fetching logs...</p>
            </div>
          ) : logs?.length === 0 ? (
            <div className="state-box">
              <History className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400">No recent activity found in the system</p>
            </div>
          ) : (
            <div className="activity-table-wrapper">
              <table className="activity-table">
                <thead className="activity-thead">
                  <tr>
                    <th className="activity-th">Admin</th>
                    <th className="activity-th">Action</th>
                    <th className="activity-th">Description</th>
                    <th className="activity-th">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.map((log) => (
                    <tr key={log.id} className="activity-tr">
                      <td className="activity-td">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-500" />
                           </div>
                           <span className="font-semibold text-slate-900">{log.admin_name}</span>
                        </div>
                      </td>
                      <td className="activity-td">
                        <span className={`action-badge ${getActionClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="activity-td italic text-slate-500">
                        {log.description}
                      </td>
                      <td className="activity-td font-mono text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}