/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { io } from "socket.io-client";

const SocketContext: any = React.createContext(null);

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider = ({ children }: any) => {
  const [socket, setSocket] = React.useState<any>(null);
  const [onlineUsers, setOnlineUsers] = React.useState<Array<any>>([]);
  React.useEffect(() => {
    const token: any = localStorage.getItem("u_pk");
    if (token === null) {
      if (socket) {
        socket.disconnect();
      }
    }
    const newSocket: any = io("http://localhost:3000", {
      extraHeaders: {
        "bearer-token": token,
        "api-key": "233fc1e0-598d-4ee0-8e72-5f4a6628fa46",
      },
      autoConnect: true,
    });
    setSocket(newSocket);
    newSocket.on("online_users", (value: any) => {
      setOnlineUsers(value);
    });
    return () => newSocket.close();
  }, []);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
