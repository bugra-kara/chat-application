import * as React from "react";
import { useLoaderData } from "react-router-dom";
import { Chat, Groups, OnlineUsers, People } from "../components";
import { useSocket } from "../socket/socketContext";
function Home() {
  const data: any = useLoaderData();
  const { onlineUsers }: any = useSocket();
  const [chats] = React.useState<Array<any>>(data !== null ? data.chats : []);
  const [groups, setGroups] = React.useState<Array<any>>(
    data !== null ? data.groups : []
  );
  const [user] = React.useState<string>(data !== null ? data.user : "");
  const [chat, setChat] = React.useState<{
    content: "Single" | "Group" | null;
    uid: string | null;
    user: string | null;
  }>({ content: null, uid: null, user: null });
  return (
    <>
      <div className="flex flex-row gap-10 w-full">
        <div className="grid grid-rows-3 gap-10 basis-4/12 w-full">
          <OnlineUsers
            onlineUsers={onlineUsers}
            user={user}
            setChat={setChat}
          />
          <Groups groups={groups} setChat={setChat} setGroups={setGroups} />
          <People chats={chats} setChat={setChat} user={user} />
        </div>
        <div className="basis-8/12 w-full">
          {chat.content !== null && chat.uid !== null && (
            <Chat chat={chat} user={user} />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
