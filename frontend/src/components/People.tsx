import * as React from "react";

function People(props: {
  chats: Array<{ _id: string; users: Array<string>; uid: string }>;
  setChat: any;
  user: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg px-3 py-5 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)]">
        <span className="text-text font-semibold text-lg">People</span>
        <div className="flex flex-col gap-3 overflow-y-auto">
          {Array.isArray(props.chats) && props.chats.length > 0
            ? props.chats.map((e) => {
                const user = e.users.filter((c) => c !== props.user);
                return (
                  <div
                    className="flex flex-col gap-2 cursor-pointer"
                    key={e.uid}
                    onClick={() => {
                      props.setChat({
                        content: "Single",
                        uid: e.uid,
                        user: user[0],
                      });
                    }}
                  >
                    <div className="flex flex-row gap-4 items-center">
                      <span className="flex p-5 bg-black rounded-full"></span>
                      <div>
                        <span className="text-text font-normal text-base">
                          {user[0]}
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

export default People;
