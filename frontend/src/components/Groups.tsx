import * as React from "react";
import api from "../api";
import { useSocket } from "../socket/socketContext";

function Groups(props: {
  groups: Array<{ _id: string; name: string; uuid: string }>;
  setChat: any;
  setGroups: any;
}) {
  const { socket }: any = useSocket();
  const [name, setName] = React.useState<string>("");
  const handleNewGroup = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const res: any = await api("message/createGroupChat", "POST", { name });
      if (res.status === "success") {
        props.setGroups(() => {
          return [...props.groups, { name, uuid: res.uuid }];
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg px-3 py-5 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)]">
        <div className="flex flex-row justify-between">
          <span className="text-text font-semibold text-lg">Groups</span>
          <form onSubmit={handleNewGroup} className="flex flex-row gap-5">
            <input
              type="text"
              name=""
              id=""
              className="w-32 border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="text-white rounded-lg px-1 bg-primaryColor"
            >
              +
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {Array.isArray(props.groups) && props.groups.length > 0
            ? props.groups.map((e) => {
                return (
                  <div
                    className="flex flex-col gap-2 cursor-pointer"
                    key={e.uuid}
                    onClick={() => {
                      props.setChat({ content: "Group", uid: e.uuid });
                      socket.emit("join_group", { groupId: e.uuid });
                    }}
                  >
                    <div className="flex flex-row gap-4 items-center">
                      <span className="flex p-5 bg-black rounded-full"></span>
                      <div>
                        <span className="text-text font-normal text-base">
                          {e.name}
                        </span>
                      </div>
                    </div>
                    <span className="border border-gray-200" />
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
}

export default Groups;
