import '../styles/admin/AdminDashboard.css';


export function DashboardCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${bg || 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${color || 'text-slate-600'}`} />
        </div>
      )}
    </div>
  );
}