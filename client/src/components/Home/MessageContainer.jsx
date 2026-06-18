import React, { useEffect, useRef, useState } from "react";
import { GoCircle } from "react-icons/go";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";

import Loader from "../common/Loader";
import { socketManager } from "../../redux/slices/socket"; // ✅ Use module-level socket

const MessageContainer = ({ chatUserId }) => {
  const { token } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.user);
  // ✅ We read the boolean connected flag just to re-run the effect when it changes
  const socketConnected = useSelector((state) => state.socketIo.socket);

  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  const messageRef = useRef(null);

  const getAllMessages = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-messages/${chatUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response?.data?.success) {
        throw new Error("Error while fetching messages");
      }

      // ✅ allMessages is an object with .messages array (populated conversation)
      setAllMessages(response.data.allMessages?.messages || []);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setMsgLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/send-message`,
        { receiverId: chatUserId, message },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response?.data?.success) {
        throw new Error("Error while sending message");
      }

      setAllMessages((prev) => [...prev, response.data.newMessage]);
      setMessage("");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    if (chatUserId) {
      setAllMessages([]); // clear before loading new chat
      getAllMessages();
    }
  }, [chatUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // ✅ Listen for incoming socket messages via socketManager (not Redux state)
  useEffect(() => {
    const socket = socketManager.getSocket();
    if (!socket || !chatUserId) return;

    const handleMessage = (data) => {
      if (data?.senderId === chatUserId || data?.receiverId === chatUserId) {
        setAllMessages((prev) => [...prev, data]);
      }
    };

    socket.on("new-message", handleMessage);

    return () => {
      socket.off("new-message", handleMessage);
    };
  }, [socketConnected, chatUserId]);

  if (!chatUserId) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="relative">
          <GoCircle size={77} />
          <FaFacebookMessenger className="absolute top-5 left-5" size={36} />
        </div>
        <p className="text-[18px] mt-2">
          Start chatting... or just stare at this screen awkwardly 🤭
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        <div className="h-[90%] overflow-y-auto">
          {allMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-3xl">
              No Conversation 🙂
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {allMessages.map((msg, index) => (
                <div
                  key={msg?._id || index}
                  className={
                    msg?.senderId === userData?._id ||
                    msg?.senderId?._id === userData?._id
                      ? "self-end"
                      : "self-start"
                  }
                >
                  {msg?.senderId === userData?._id ||
                  msg?.senderId?._id === userData?._id ? (
                    <div className="flex gap-1 text-white">
                      <p className="bg-gray-700 px-3 py-2 rounded-full font-semibold">
                        {msg?.message}
                      </p>
                      <p className="text-xs mt-6">
                        {moment(msg?.createdAt).format("h:mm A")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <p className="text-xs mt-6">
                        {moment(msg?.createdAt).format("h:mm A")}
                      </p>
                      <p className="bg-gray-100 text-black px-3 py-2 rounded-full font-semibold">
                        {msg?.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messageRef}></div>
            </div>
          )}
        </div>
      )}

      <div className="h-[10%] border-t border-gray-950">
        <form
          onSubmit={sendMessage}
          className="h-full w-full flex items-center px-2 gap-2"
        >
          <input
            type="text"
            placeholder="Send a message..."
            className="w-[95%] h-[80%] rounded-full bg-gray-900 px-3 py-2 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={msgLoading}
            className="bg-gray-900 h-12 w-12 rounded-full flex items-center justify-center disabled:opacity-60"
          >
            <IoIosSend
              size={30}
              className={msgLoading ? "animate-spin" : ""}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageContainer;
