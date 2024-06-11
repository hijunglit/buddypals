import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: '',
  username: '',
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
  },
});

export const {setUser} = userSlice.actions;

export const selectId = (state: any) => state.user.userId;
export const selectUsername = (state: any) => state.user.username;

export default userSlice;