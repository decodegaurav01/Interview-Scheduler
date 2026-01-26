import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/auth/AdminLogin";
import { ProtectedRoute } from "./ProctectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateLogin from "../pages/auth/CandidateLogin";
import AdminInterviewBookings from "../pages/admin/AdminInterviewBookings";
import CandidateInterviewDetails from "../pages/candidate/CandidateInterviewDetails";
import AdminActivity from "../pages/admin/AdminActivity";
import Slots from "../pages/admin/Slots";
import Whitelisted from "../pages/admin/Whitelisted";



export default function AppRoutes() {


    return (
        <>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/candidate-login" element={<CandidateLogin />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={

                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <AdminDashboard />
                    </ProtectedRoute>

                } />
                <Route path="/admin/whitelist-candidate" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <Whitelisted />
                    </ProtectedRoute>

                } />
                <Route path="/admin/slots" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <Slots />
                    </ProtectedRoute>
                } />

                <Route path="/admin/activity" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <AdminActivity />
                    </ProtectedRoute>
                }/>
                <Route path="/admin/interviews" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <AdminInterviewBookings />
                    </ProtectedRoute>
                }/>

                {/* Candidate */}
                <Route path="/candidate-dashboard" element={
                    <ProtectedRoute requiredRole={"CANDIDATE"}>
                        <CandidateDashboard />
                    </ProtectedRoute>

                } />
                <Route path="/candidate/interview" element={
                    <ProtectedRoute requiredRole={"CANDIDATE"}>
                        <CandidateInterviewDetails />
                    </ProtectedRoute>

                } />
                 <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>


        </>
    );
} 