
import React from "react"
import { useState } from 'react';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import '../../styles/admin/AdminLogin.css'
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import StatusAlert from "../../components/StatusAlert";

export default function AdminLogin() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationSent, setIsVerificationSent] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {

            if (email.length === 0)
                setError("Please enter email");
            else if (password.length === 0)
                setError("Please enter password")
            else {

                const res = await adminLogin(email, password);

                if (res) {

                    localStorage.setItem('token', res.token);
                    localStorage.setItem('role', res.role);

                    setSuccess('Verification successful! Redirecting...');
                    setIsVerificationSent(true);

                    setTimeout(() => {
                        navigate('/admin/dashboard')
                    }, 1500);

                } else
                    setError("Invalid Email or Password")
            }


        } catch (err) {
            setError(err ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page-wrapper">
            <div className="admin-login-card-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-login-icon-box">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="admin-login-title">Interview Scheduler</h1>
                        <p className="admin-login-subtitle">Welcome back! Please enter your details.</p>
                    </div>

                    <StatusAlert
                        error={error}
                        success={success}
                        reset={() => { setError(''); setSuccess(''); }}
                    />

                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading || isVerificationSent} className="btn-submit">
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p className="text-sm text-muted-foreground">
                            Are you a candidate?{' '}
                            <Link to="/candidate-login" className="cadidate-login-link">
                                Candidate Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
