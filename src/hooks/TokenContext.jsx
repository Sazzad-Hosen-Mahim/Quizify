/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [approvalToken, setApprovalToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        setApprovalToken(parsedToken?.approvalToken || null);
      } catch (error) {
        console.error("Error parsing token from cookies:", error);
      }
    }
  }, []);

  return (
    <TokenContext.Provider value={{ approvalToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
