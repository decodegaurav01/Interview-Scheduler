import { useNavigate } from "react-router-dom";


export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Your email is not whitelisted. Please contact the administrator to request access.
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminEmail');
            localStorage.removeItem('candidateToken');
            localStorage.removeItem('candidateEmail');
            navigate('/candidate/login');
          }}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Candidate Login
        </button>
      </div>
    </div>
  );
}
