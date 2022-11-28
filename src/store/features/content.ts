import { createSlice } from '@reduxjs/toolkit'

export const contentSlice = createSlice({
  name: 'user',
  initialState: {
    entry: {}
  },
  reducers: {
    fillContent: (state, action) => {
      const { payload } = action
      state.entry = payload.entry
    }
  },
})

export const { fillContent } = contentSlice.actions


export default contentSlice.reducer