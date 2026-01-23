
import React from "react"


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


export function ProtectedRoute({ children, requiredRole }) {
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/');
      return;
    }

    if (requiredRole && role !== requiredRole) {
      navigate('/');
      return;
    }


  }, [navigate, requiredRole]);



  return <>{children}</>;
}
