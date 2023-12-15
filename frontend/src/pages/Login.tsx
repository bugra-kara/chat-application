/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import api from "../api";
import errorHandler from "../utils/errorHandler";
import { notify } from "../utils/notification";
import request from "axios";
interface ILoginInput {
  email: string;
  password: string;
}
function Login() {
  const { register, handleSubmit } = useForm<ILoginInput>();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    setLoading(true);
    try {
      const response: any = await api("auth/login", "POST", data);
      setLoading(false);
      if (response.status === "success") {
        localStorage.setItem("u_email", response.email);
        localStorage.setItem("u_pk", response.access_token);
        notify(201, "Welcome!");
        setTimeout(() => {
          navigate("/");
        }, 500);
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
        <div className="container justify-center w-full flex">
          <div className="py-5 px-3 m-3 rounded-lg shadow flex flex-col space-y-3 w-fit bg-white">
            <div className="text-center font-black">Login</div>
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
              <div className="flex justify-between">
                <button
                  type="submit"
                  className={`text-white px-3 py0.5 font-bold rounded-lg ${
                    loading ? "bg-slate-500 cursor-wait" : "bg-primaryColor"
                  }`}
                  disabled={loading}
                >
                  Login
                </button>
                <Link
                  to="/register"
                  className={`text-white px-3 py0.5 font-bold rounded-lg ${
                    loading ? "bg-slate-500 cursor-wait" : "bg-primaryColor"
                  }`}
                >
                  Register
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

export default Login;
