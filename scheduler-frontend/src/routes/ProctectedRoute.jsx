
import React from "react"


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


export function ProtectedRoute({ children, requiredRole }) {
  const navigate = useNavigate()


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

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
