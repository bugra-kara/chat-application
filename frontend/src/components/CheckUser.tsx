/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";

function CheckUser({ children }: any) {
  const public_key = localStorage.getItem("u_pk");
  const email = localStorage.getItem("u_email");
  if (public_key !== null && email !== null) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default CheckUser;
