import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { removeToken } from "../../redux/slices/auth";
import { setUserDetails } from "../../redux/slices/user";
import Loader from "../common/Loader";

const SideBar = ({ setChatUserId, chatUserId }) => {
  const { userData } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const { allOnlineUsers } = useSelector((state) => state.socketIo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [originalAllUsers, setOriginalAllUsers] = useState([]);

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    dispatch(removeToken());
    dispatch(setUserDetails(null));

    toast.success("Logout Successfully");
    navigate("/login");
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response?.data?.success) {
        throw new Error("Error while fetching users");
      }

      setAllUsers(response.data.allUsers || []);
      setOriginalAllUsers(response.data.allUsers || []);
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUsers();
    }
  }, [token]);

  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setAllUsers(originalAllUsers);
      return;
    }

    const filteredUsers = originalAllUsers.filter((user) => {
      const fullName = `${user?.firstName} ${user?.lastName}`.toLowerCase();

      return fullName.includes(value);
    });

    setAllUsers(filteredUsers);
  };

  return (
    <div className="h-full">
      <div className="h-[90%] px-4 py-1">
        {/* Logo */}
        <div className="h-[20%]">
          <h2 className="font-semibold text-3xl text-cyan-300 flex items-center">
            <p>Vartala</p>
            <p className="text-5xl text-yellow-400 animate-bounce">P</p>
          </h2>

          {/* Search */}
          <div className="w-full mt-3">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full outline-none bg-gray-600 rounded-full py-2 px-3 text-[18px]"
              onChange={searchHandler}
            />
          </div>
        </div>

        {/* Users */}
        <div className="h-[80%] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          ) : (
            <>
              {allUsers.length < 1 ? (
                <div className="text-center mt-40 font-semibold">
                  Users not found
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {allUsers.map((user) => (
                    <div
                      key={user?._id}
                      onClick={() => setChatUserId(user?._id)}
                      className={`flex flex-row gap-4 items-center cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-gray-950 ${
                        chatUserId === user?._id ? "bg-gray-950" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={user?.profilePicture}
                          alt={`${user?.firstName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        {allOnlineUsers.includes(user?._id) && (
                          <div className="h-4 w-4 rounded-full bg-green-400 absolute bottom-0 right-0"></div>
                        )}
                      </div>

                      <div>
                        <p>
                          <span>{user?.firstName}</span>{" "}
                          <span>{user?.lastName}</span>
                        </p>

                        {allOnlineUsers.includes(user?._id) ? (
                          <p className="text-green-400 font-semibold">Online</p>
                        ) : (
                          <p className="text-red-400 font-semibold">Offline</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="h-[10%] px-3 py-1 flex flex-row items-center justify-between border-t border-gray-950">
        <div className="flex items-center gap-2">
          <img
            src={userData?.profilePicture}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover"
          />

          <p className="font-semibold">
            <span>{userData?.firstName}</span> <span>{userData?.lastName}</span>
          </p>
        </div>

        <button
          className="bg-gray-950 px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-800"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
