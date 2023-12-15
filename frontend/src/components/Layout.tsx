import * as React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <>
      <div className="flex w-screen h-screen justify-center py-8">
        <div className="flex flex-row gap-5 container">
          <Sidebar />
          <Outlet />
        </div>
      </div>
      <ToastContainer className="z-20" />
    </>
  );
}

export default Layout;
