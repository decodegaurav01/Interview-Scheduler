
import React from "react"
import { useState } from 'react';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import '../../styles/Login.css'

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {


            // Store token and role
            //   localStorage.setItem('token', data.token);
            //   localStorage.setItem('role', data.role);
            //   localStorage.setItem('email', data.email);

            // Redirect based on role
            //   if (data.role === 'admin') {
            //     navigate('/admin/dashboard');
            //   } else {
            //     navigate('/candidate/slots');
            //   }
        } catch (err) {
            setError(err ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon-box">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="login-title">Interview Scheduler</h1>
                        <p className="login-subtitle">Welcome back! Please enter your details.</p>
                    </div>

                    {error && (
                        <div className="login-error-alert animate-login-entry">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
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

                        <button type="submit" disabled={isLoading} className="btn-submit">
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner" />
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="login-footer">
                        Don't have an account? <a href="#" className="login-link">Request access</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
