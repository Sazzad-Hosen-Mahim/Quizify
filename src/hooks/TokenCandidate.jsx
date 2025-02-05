import { useState, useEffect } from "react";

export const useCandidateToken = () => {
  const [approvalToken, setApprovalToken] = useState(null);
  const [candidId, setCandidId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("candidateToken");
    const storedCandidId = localStorage.getItem("candidId");

    if (storedToken) {
      setApprovalToken(storedToken);
    }
    if (storedCandidId) {
      setCandidId(storedCandidId);
    }
  }, []);

  return { approvalToken, candidId };
};
