import api from "../api";

export const homeLoader = async () => {
  try {
    const [chats, groups]: any = await Promise.all([
      await api("message/userMessages", "GET", undefined),
      await api("message/groupMessages", "GET", undefined),
    ]);
    if (chats.response.status === "success" && groups.status === "success") {
      const user = localStorage.getItem("u_email");
      return { chats: chats.response.data, groups: groups.data, user };
    } else {
      return null;
    }
  } catch (error: any) {
    return null;
  }
};
