import * as React from "react";
import { toLocaleTimeZone } from "../utils/converter";

function SingleChat(props: { uid: string; messages: Array<[]>; user: string }) {
  const messageRef: any = React.useRef();
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  React.useEffect(() => {
    scrollToBottom();
  }, [props]);
  return (
    <>
      <>
        <div className="flex flex-col gap-2">
          {Array.isArray(props.messages) &&
            props.messages.length > 0 &&
            props.messages.map((e: any, i) => {
              if (props.user === e.sender_email) {
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
                  <div
                    key={i}
                    className="flex flex-col w-full items-start gap-1"
                  >
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
    </>
  );
}

export default SingleChat;
