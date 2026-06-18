import { createSlice } from "@reduxjs/toolkit";

/*
  ✅ Socket Singleton Manager
  (Socket object Redux me store nahi hota)
*/
export const socketManager = {
  _socket: null,

  setSocket(socketInstance) {
    this._socket = socketInstance;
  },

  getSocket() {
    return this._socket;
  },

  disconnect() {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  },
};

/*
  ✅ Redux State (only serializable data)
*/
const initialState = {
  isSocketConnected: false,
  allOnlineUsers: [],
};

/*
  ✅ Slice
*/
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketConnection: (state, action) => {
      state.isSocketConnected = action.payload;
    },

    setAllOnlineUsers: (state, action) => {
      state.allOnlineUsers = action.payload;
    },
  },
});

/*
  ✅ Export actions
*/
export const { setSocketConnection, setAllOnlineUsers } = socketSlice.actions;

/*
  ✅ Export reducer
*/
export default socketSlice.reducer;
