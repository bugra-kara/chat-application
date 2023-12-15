/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../api";
import { notify } from "../utils/notification";
import { AxiosError } from "axios";
import request from "axios";
import { ToastContainer } from "react-toastify";
import errorHandler from "../utils/errorHandler";
interface IRegisterInput {
  email: string;
  password: string;
  username: string;
  full_name: string;
}
function Register() {
  const { register, handleSubmit } = useForm<IRegisterInput>();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IRegisterInput> = async (data) => {
    setLoading(true);
    try {
      const response: any = await api("auth/register", "POST", data);
      setLoading(false);
      if (response.result === "success") {
        notify(201, response.msg);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        notify(400, response.msg);
      }
    } catch (error: AxiosError | any) {
      setLoading(false);
      if (request.isAxiosError(error) && error.response) {
        errorHandler(error);
      }
    }
  };

  return (
    <>
      <div className="h-screen flex items-center w-screen justify-center">
        <div className="container justify-center flex">
          <div className="py-5 px-3 m-3 rounded-lg shadow flex flex-col space-y-3 w-fit bg-white">
            <div className="text-center font-black">Register</div>
            <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full border"
                {...register("email", { required: true })}
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="w-full border"
                {...register("password", { required: true })}
              />
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="w-full border"
                {...register("username", { required: true })}
              />
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                className="w-full border"
                {...register("full_name", { required: true })}
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className={`text-white px-3 py0.5 font-bold rounded-lg ${
                    loading ? "bg-slate-500 cursor-wait" : "bg-primaryColor"
                  }`}
                  disabled={loading}
                >
                  Register
                </button>
                <Link
                  to="/login"
                  className={`text-white px-3 py0.5 font-bold rounded-lg ${
                    loading ? "bg-slate-500 cursor-wait" : "bg-primaryColor"
                  }`}
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer className="z-20" />
    </>
  );
}

export default Register;
