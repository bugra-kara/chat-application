/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
function ProtectedRoute({ children }: any) {
  const didLogRef = React.useRef(false);
  const public_key = localStorage.getItem("u_pk");
  const email = localStorage.getItem("u_email");

  const checkUser = async () => {
    try {
      const response: any = await api("auth/checkUser", "GET", undefined);
      if (response.status !== "success") {
        localStorage.clear();
        await api("auth/logout", "POST", undefined);
      }
    } catch (error) {
      localStorage.clear();
      await api("auth/logout", "POST", undefined);
    }
  };

  React.useEffect(() => {
    if (didLogRef.current === false && public_key !== null && email !== null) {
      didLogRef.current = true;
      checkUser();
    }
  }, []);
  if (public_key === null && email === null) {
    return <Navigate to="/login" />;
  } else return children;
}

export default ProtectedRoute;
