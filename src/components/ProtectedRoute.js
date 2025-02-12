import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the token exists, render the child component (protected page)
  return children;
}

export default ProtectedRoute;
