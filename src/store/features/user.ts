import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userSetup: false,
    credential: {
      url: '',
      token: '',
    },
  },
  reducers: {
    setupUser: (state, action) => {
      const { payload } = action
      state.userSetup = true
      state.credential = payload
    }
  },
})

export const { setupUser } = userSlice.actions


export default userSlice.reducer