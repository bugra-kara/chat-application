import * as React from "react";
import { FaUser, FaRocketchat, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import api from "../api";
import { notify } from "../utils/notification";
import { ToastContainer } from "react-toastify";

function Sidebar() {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      const response: any = await api("auth/logout", "POST", undefined);
      if (response.status === "success") {
        notify(200, response.msg);
        localStorage.clear();
        navigate("/login");
      } else {
        navigate("/login");
        localStorage.clear();
      }
    } catch (error) {
      navigate("/login");
      localStorage.clear();
    }
  };
  return (
    <React.Fragment>
      <div className="flex bg-primaryColor rounded-lg justify-center py-5 text-white">
        <div className="flex flex-col items-center justify-between">
          <div className="flex flex-col gap-20">
            <span className="border-2 border-white p-2 rounded-full mx-3">
              <FaUser size={25} />
            </span>
            <div className="flex flex-col gap-5 w-full">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? " bg-secondaryColor/50 w-full flex justify-center py-5 border-r-4 border-active"
                    : "w-full flex justify-center py-5"
                }
              >
                <FaRocketchat size={25} />
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? " bg-secondaryColor/50 w-full flex justify-center py-5 border-r-4 border-active"
                    : "w-full flex justify-center py-5"
                }
              >
                <IoIosSettings size={25} />
              </NavLink>
            </div>
          </div>
          <button onClick={handleSignOut}>
            <FaSignOutAlt size={25} />
          </button>
        </div>
      </div>
      <ToastContainer className="z-20" />
    </React.Fragment>
  );
}

export default Sidebar;
