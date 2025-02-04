/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [approvalToken, setApprovalToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setApprovalToken(parsedUser?.approvalToken || null);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing token from cookies:", error);
      }
    }
  }, []);

  return (
    <TokenContext.Provider value={{ approvalToken, user }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
