import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: '',
  username: '',
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
    },
  },
});

export const {setUser} = userSlice.actions;

export const selectId = (state: any) => state.user._id;
export const selectUsername = (state: any) => state.user.username;

export default userSlice;