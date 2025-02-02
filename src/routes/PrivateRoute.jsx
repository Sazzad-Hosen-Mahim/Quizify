import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const roleBasedRoutes = {
  admin: "/admin/dashboard",
  examinee: "/examinee/dashboard",
  candidate: "/candidate/dashboard",
};

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      console.warn("No user data found in cookies");
      setUser(null);
    }

    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("User not found, redirecting to login");
    return <Navigate to="/login" replace state={{ path: pathname }} />;
  }

  // console.log(`User role: ${user.role}, Allowed roles: ${allowedRoles}`);

  if (!allowedRoles.includes(user.role)) {
    console.log(
      `Unauthorized access to ${pathname}, redirecting to ${
        roleBasedRoutes[user.role] || "/"
      }`
    );
    return <Navigate to={roleBasedRoutes[user.role] || "/"} replace />;
  }

  return children;
}
