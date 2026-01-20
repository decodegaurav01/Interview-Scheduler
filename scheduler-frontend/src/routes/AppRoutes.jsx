import { Routes, Route } from "react-router-dom";

import AdminLogin from "../pages/auth/AdminLogin";
import { ProtectedRoute } from "./ProctectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import WhitelistCandidate from "../pages/admin/whitelistCandidate";
import Slot from "../pages/admin/Slots";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";



export default function AppRoutes() {

    // const role = sessionStorage.getItem("role");

    return (
        <>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={

                    <AdminDashboard />

                } />
                <Route path="/admin/whitelist-candidate" element={

                    <WhitelistCandidate />

                } />
                <Route path="/admin/slots" element={

                    <Slot />

                } />

                {/* Candidate */}
                <Route path="/candidateDashboard" element={

                    <CandidateDashboard />

                } />
            </Routes>


        </>
    );
} 