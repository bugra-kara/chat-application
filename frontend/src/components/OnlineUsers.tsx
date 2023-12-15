/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import * as React from "react";
import api from "../api";
import request from "axios";
import errorHandler from "../utils/errorHandler";
function OnlineUsers(props: {
  onlineUsers: Array<any>;
  user: string;
  setChat: any;
}) {
  const handleCreateChat = async (email: string) => {
    try {
      const response: any = await api("message/createSingleUserChat", "POST", {
        user: email,
      });
      if (
        response.status === "error" &&
        response.msg === "Chat already exist!"
      ) {
        props.setChat({ content: "Single", uid: response.uid, user: email });
      } else {
        props.setChat({ content: "Single", uid: response.uid, user: email });
      }
    } catch (error: AxiosError | any) {
      if (request.isAxiosError(error) && error.response) {
        errorHandler(error);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg px-3 py-5 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)]">
        <span className="text-text font-semibold text-lg">Online Users</span>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {Array.isArray(props.onlineUsers) && props.onlineUsers.length > 0
            ? props.onlineUsers.map((e, i) => {
                if (e.email !== props.user) {
                  return (
                    <div
                      className="flex flex-col gap-2 cursor-pointer"
                      key={i}
                      onClick={() => handleCreateChat(e.email)}
                    >
                      <div className="flex flex-row gap-4 items-center">
                        <span className="flex p-5 bg-black rounded-full"></span>
                        <div>
                          <span className="text-text font-normal text-base">
                            {e.email}
                          </span>
                        </div>
                      </div>
                      <span className="border border-gray-200" />
                    </div>
                  );
                }
              })
            : ""}
        </div>
      </div>
    </>
  );
}

export default OnlineUsers;
