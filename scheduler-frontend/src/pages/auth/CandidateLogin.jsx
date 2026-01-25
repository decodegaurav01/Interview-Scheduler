import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/candidate/CandidateLogin.css"
import { candidateLogin } from '../../services/authService';
import StatusAlert from '../../components/StatusAlert';


export default function CandidateLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await candidateLogin(email);

            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('role', res.role);

            setSuccess('Verification successful! Redirecting...');
            setIsVerificationSent(true);


            setTimeout(() => {
                navigate('/candidate-dashboard');
            }, 1500);
        } catch (err) {
            console.log(err)
            setError("This email is not on the whitelist");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="candidateLogin-page-wrapper">
            <div className="candidateLogin-card-container">
                <div className="candidateLogin-card">
                    <header className="candidateLogin-header">
                        <h1 className="candidateLogin-title">Interview Scheduler</h1>
                        <p className="candidateLogin-subtitle">Candidate Login</p>
                    </header>

                    <StatusAlert
                        error={error}
                        success={success}
                        reset={() => { setError(''); setSuccess(''); }}
                    />

                    <div className="candidateLogin-form">
                        <div>
                            <label className="candidateLogin-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
                                placeholder="candidate@example.com"
                                className="candidateLogin-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyEmail}
                            disabled={isLoading || isVerificationSent}
                            className="btn-candidateLogin-submit"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </span>
                            ) : isVerificationSent ? 'Verified' : 'Verify & Continue'}
                        </button>
                    </div>

                    <div className="candidateLogin-footer-link">
                        Are you an admin?{' '}
                        <Link to="/admin-login" className="candidateLogin-link">
                            Admin Login
                        </Link>
                    </div>


                </div>
            </div>
        </div>
    );
}
