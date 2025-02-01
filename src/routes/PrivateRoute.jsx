import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
export default function PrivateRoute({ children }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const userRef = useRef(null);

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
  }, [pathname]);

  if (user === null) {
    return <div>Loading...</div>; // Prevent navigation check until user state is set
  }

  // Restrict admins from accessing "/dashboard"
  if (user?.role === "admin" && pathname === "/dashboard") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.id) {
    return children;
  }

  return <Navigate to="/login" replace state={{ path: pathname }} />;
}
