import { notify } from "../utils/notification";
export default function errorHandler(error: any) {
  notify(
    error.response.status,
    error.response.data?.message[0] !== undefined
      ? error.response.data.message[0]
      : error.response.data.error
  );
}
