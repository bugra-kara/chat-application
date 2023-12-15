/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import * as React from "react";
import { IoIosSend } from "react-icons/io";
import api from "../api";
import errorHandler from "../utils/errorHandler";
import request from "axios";
import GroupChat from "./GroupChat";
import SingleChat from "./SingleChat";
import { useSocket } from "../socket/socketContext";
function Chat(props: {
  chat: {
    content: "Single" | "Group" | null;
    uid: string | null;
    user: string | null;
  };
  user: string;
}) {
  const currentUserRef = React.useRef(props);
  const { socket, onlineUsers }: any = useSocket();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string>("");
  const [data, setData] = React.useState<any>();
  const handleChat = async () => {
    setLoading(true);
    try {
      const response: any = await api(
        props.chat.content === "Group"
          ? "message/getGroupMessage"
          : "message/getSingleUserMessages",
        "POST",
        { uid: props.chat.uid }
      );
      setData(
        props.chat.content === "Group"
          ? response.data[0]
          : response.response.data[0]
      );
      setLoading(false);
    } catch (error: AxiosError | any) {
      setLoading(false);
      if (request.isAxiosError(error) && error.response) {
        errorHandler(error);
      }
    }
  };
  const handleMessage = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      if (props.chat.content === "Single") {
        const date = new Date();
        socket.emit("send_private_message", {
          message: {
            content: message,
            receiver_email: props.chat.user,
            uid: props.chat.uid,
            date,
          },
        });
        setMessage("");
        setData((d: any) => {
          return {
            ...d,
            messages: [
              ...data.messages,
              { sender_email: props.user, content: message, date },
            ],
          };
        });
      } else if (props.chat.content === "Group") {
        socket.emit("send_group_message", {
          groupId: props.chat.uid,
          message: message,
        });
        setMessage("");
      }
    } catch (error) {
      if (request.isAxiosError(error) && error.response) {
        errorHandler(error);
      }
    }
  };
  const handleReceiveMessage = (value: any) => {
    const receivedData = JSON.parse(value);
    const user = onlineUsers.filter((e: any) => e.id === receivedData.senderId);
    if (
      Array.isArray(user) &&
      user.length > 0 &&
      currentUserRef.current?.chat.user === user[0].email
    ) {
      setNewMessage(
        props.chat.user !== null ? props.chat.user : "",
        receivedData.date,
        receivedData.content
      );
    }
  };
  const handleGroupMessage = (value: any) => {
    const receivedData = value;
    setNewMessage(receivedData.email, receivedData.date, receivedData.message);
  };
  const setNewMessage = (email: string, date: any, newMessage: string) => {
    if (currentUserRef.current.chat.content === "Group") {
      setData((d: any) => {
        return {
          ...d,
          messages: [
            ...d.messages,
            {
              email: email,
              content: newMessage,
              date: date,
            },
          ],
        };
      });
    } else {
      setData((d: any) => {
        return {
          ...d,
          messages: [
            ...d.messages,
            {
              sender_email: email,
              content: newMessage,
              date: date,
            },
          ],
        };
      });
    }
  };
  React.useEffect(() => {
    currentUserRef.current = props;
  }, [props]);
  React.useEffect(() => {
    socket.on("receive_private_message", handleReceiveMessage);
    socket.on("receive_group_message", handleGroupMessage);
    return () => {
      socket.off("receive_private_message", handleReceiveMessage);
      socket.off("receive_group_message", handleGroupMessage);
    };
  }, []);
  React.useEffect(() => {
    handleChat();
  }, [props.chat.uid]);

  if (loading) {
    return <></>;
  }
  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg px-7 py-5 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)] h-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4 items-center">
            <span className="flex p-5 bg-black rounded-full"></span>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-text font-normal text-base">
                {props.chat.content === "Group"
                  ? data?.name
                  : props.chat.content === "Single"
                  ? props.chat.user
                  : ""}
              </span>
              {props.chat.content === "Single" &&
                onlineUsers.some((e: any) => e.email === props.chat.user) && (
                  <span className="font-normal text-sm text-green-500">
                    Online
                  </span>
                )}
            </div>
          </div>
          <span className="border border-gray-200" />
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto h-full">
          {!loading &&
          props.chat.content === "Group" &&
          props.chat.uid !== null ? (
            <GroupChat
              uid={props.chat.uid}
              messages={data?.messages}
              user={props.user}
            />
          ) : !loading &&
            props.chat.content === "Single" &&
            props.chat.uid !== null ? (
            <SingleChat
              uid={props.chat.uid}
              messages={data?.messages}
              user={props.user}
            />
          ) : (
            ""
          )}
        </div>
        <form
          onSubmit={handleMessage}
          className="flex flex-row justify-between gap-5"
        >
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            className="w-full bg-input/90 pl-5 text-sm font-normal rounded-lg py-3"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            onClick={handleMessage}
            className=" bg-primaryColor p-2 rounded-lg"
          >
            <IoIosSend color="#fff" size={25} />
          </button>
        </form>
      </div>
    </>
  );
}

export default Chat;
