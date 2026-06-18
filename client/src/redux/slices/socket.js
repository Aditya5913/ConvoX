import { createSlice } from "@reduxjs/toolkit";

// ✅ Module-level singleton for the actual socket instance
// (Socket objects are non-serializable and must NOT go into Redux state)
export const socketManager = {
  _socket: null,
  setSocket(s) {
    this._socket = s;
  },
  getSocket() {
    return this._socket;
  },
};

const initialState = {
  // ✅ Boolean flag instead of the socket object
  socket: false,
  allOnlineUsers: [],
};

export const socketSlice = createSlice({
  name: "socketIo",
  initialState,

  reducers: {
    // payload: true (connected) | false (disconnected)
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setAllOnlineUsers: (state, action) => {
      state.allOnlineUsers = action.payload;
    },
  },
});

export const { setSocket, setAllOnlineUsers } = socketSlice.actions;

export default socketSlice.reducer;
