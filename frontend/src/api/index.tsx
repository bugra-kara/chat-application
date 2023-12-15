/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export default function api(endpoint: string, method: string, data: any) {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      const config: any = {
        method,
        url: `http://localhost:3000/api/${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          "api-key": "233fc1e0-598d-4ee0-8e72-5f4a6628fa46",
        },
        data: JSON.stringify(data),
        withCredentials: true,
      };
      if (localStorage.getItem("u_pk")) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem(
          "u_pk"
        )}`;
      }
      const response: any = await axios(config);
      if (response.status === 200 || response.status === 201) {
        resolve(response.data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      reject(error);
    }
  });
}
