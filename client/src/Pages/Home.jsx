import React, { useState } from "react";
import SideBar from "../components/Home/SideBar";
import MessageContainer from "../components/Home/MessageContainer";

const Home = () => {
  const [chatUserId, setChatUserId] = useState(null);

  return (
    <div className="h-[90vh] w-[80vw] flex">
      <div className="h-full w-[25%] bg-gray-500 rounded-l-md">
        <SideBar
          setChatUserId={setChatUserId}
          chatUserId={chatUserId}
        />
      </div>

      <div className="h-full w-[75%] bg-gray-400 rounded-r-md">
        <MessageContainer chatUserId={chatUserId} />
      </div>
    </div>
  );
};

export default Home;