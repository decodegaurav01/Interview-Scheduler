import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/auth/AdminLogin";
import { ProtectedRoute } from "./ProctectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import WhitelistCandidate from "../pages/admin/whitelistCandidate";
import Slot from "../pages/admin/Slots";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateLogin from "../pages/auth/CandidateLogin";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";



export default function AppRoutes() {


    return (
        <>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/candidate-login" element={<CandidateLogin />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={

                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <AdminDashboard />
                    </ProtectedRoute>

                } />
                <Route path="/admin/whitelist-candidate" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <WhitelistCandidate />
                    </ProtectedRoute>

                } />
                <Route path="/admin/slots" element={
                    <ProtectedRoute requiredRole={"ADMIN"}>
                        <Slot />
                    </ProtectedRoute>

                } />

                {/* Candidate */}
                <Route path="/candidate-dashboard" element={
                    <ProtectedRoute requiredRole={"CANDIDATE"}>
                        <CandidateDashboard />
                    </ProtectedRoute>

                } />
                 <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>


        </>
    );
} 