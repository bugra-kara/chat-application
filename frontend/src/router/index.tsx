import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login, Register, Error, Home, Settings } from "../pages";
import { CheckUser, Layout, ProtectedRoute } from "../components";
import { homeLoader } from "../loader";
import { SocketProvider } from "../socket/socketContext";
export default function Index() {
  const router = createBrowserRouter([
    {
      element: (
        <SocketProvider>
          <Layout />
        </SocketProvider>
      ),
      children: [
        {
          path: "/",
          index: true,
          loader: homeLoader,
          element: <ProtectedRoute children={<Home />} />,
        },
        {
          path: "/settings",
          element: <ProtectedRoute children={<Settings />} />,
        },
        {
          path: "*",
          element: <ProtectedRoute children={<Error />} />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <CheckUser>
          <Login />
        </CheckUser>
      ),
    },
    {
      path: "/register",
      element: (
        <CheckUser>
          <Register />
        </CheckUser>
      ),
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}
