/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateAdminRoute({ children }) {
  const location = useLocation();
  const userRef = useRef(null); // Persist user data across re-renders
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user:", parsedUser);
        userRef.current = parsedUser; // Store in ref to persist
        setUser(parsedUser); // Update state
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      console.warn("No user data found in cookies");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    console.log("Updated user state:", user);
  }, [user]);

  // Ensure persistence with `useRef`
  const persistentUser = user || userRef.current;

  // If user data is still loading, show nothing (or a loader)
  if (persistentUser === null) {
    return null; // or a loading spinner
  }

  // Redirect if not logged in
  if (!persistentUser?.id) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  // Redirect if user is not an admin
  if (persistentUser?.role !== "admin") {
    return (
      <Navigate to="/dashboard" replace state={{ path: location.pathname }} />
    );
  }

  return children;
}
