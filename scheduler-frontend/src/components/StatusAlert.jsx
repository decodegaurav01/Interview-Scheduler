import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function StatusAlert({ error, success, reset }) {
  
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, reset]);

  if (!error && !success) return null;

  const isSuccess = !!success;
  const message = success || error;

  return (
    <div className={`
      flex items-start justify-between p-4 mb-6 rounded-lg border shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2
      ${isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
    `}>
      <div className="flex gap-3">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        )}
        <div className="text-sm font-medium leading-6">
          {message}
        </div>
      </div>
    </div>
  );
}