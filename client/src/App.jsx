import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { setSocket, setAllOnlineUsers } from "./redux/slices/socket";
import { socketManager } from "./redux/slices/socket";

// ✅ Auth guard — redirects to /login if not logged in
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ Guest guard — redirects to /home if already logged in
const GuestRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return !token ? children : <Navigate to="/home" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/signup" replace />,
  },
  {
    path: "/signup",
    element: (
      <GuestRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <SignUp />
        </div>
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <Login />
        </div>
      </GuestRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <Home />
        </div>
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);

  // ✅ Initialize socket when user logs in; disconnect on logout
  useEffect(() => {
    if (token && userData?._id) {
      const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId: userData._id },
      });

      // Store socket instance in the module-level manager (not Redux state)
      socketManager.setSocket(socketInstance);
      dispatch(setSocket(true)); // store a boolean flag in Redux

      socketInstance.on("send-all-online-users", (users) => {
        dispatch(setAllOnlineUsers(users));
      });

      return () => {
        socketInstance.disconnect();
        socketManager.setSocket(null);
        dispatch(setSocket(false));
        dispatch(setAllOnlineUsers([]));
      };
    }
  }, [token, userData?._id]);

  return <RouterProvider router={router} />;
};

export default App;
