import * as React from "react";
import { useSocket } from "../socket/socketContext";
import { toLocaleTimeZone } from "../utils/converter";

function GroupChat(props: { uid: string; messages: Array<[]>; user: string }) {
  const messageRef: any = React.useRef();
  const { onlineUsers, socket }: any = useSocket();
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleOnlineMembers = (value: any) => {
    //setOnlineMembers(value);
  };
  React.useEffect(() => {
    socket.on("group_online_members", handleOnlineMembers);
    return () => {
      socket.off("group_online_members", handleOnlineMembers);
    };
  }, []);
  React.useEffect(() => {
    scrollToBottom();
  }, [props.messages]);
  return (
    <>
      <div className="flex flex-col gap-2 pr-5">
        {Array.isArray(props.messages) &&
          props.messages.length > 0 &&
          props.messages.map((e: any, i) => {
            if (props.user === e.email) {
              return (
                <div key={i} className="flex flex-col w-full items-end gap-1">
                  <span className=" bg-primaryColor text-white px-1.5 rounded-lg py-1 text-sm">
                    {e.content}
                  </span>
                  <span className="text-xs text-gray-400">
                    {toLocaleTimeZone(e.date)}
                  </span>
                </div>
              );
            } else {
              return (
                <div key={i} className="flex flex-col w-full items-start gap-1">
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs text-primaryColor font-medium">
                      {e.email}
                    </span>
                    {onlineUsers.some((o: any) => o.email === e.email) && (
                      <span className="font-normal text-sm text-green-500">
                        Online
                      </span>
                    )}
                  </div>
                  <span className="bg-messageResponse text-text px-1.5 rounded-lg py-1 text-sm">
                    {e.content}
                  </span>
                  <span className="text-xs text-gray-400">
                    {toLocaleTimeZone(e.date)}
                  </span>
                </div>
              );
            }
          })}
        <div ref={messageRef} />
      </div>
    </>
  );
}

export default GroupChat;
