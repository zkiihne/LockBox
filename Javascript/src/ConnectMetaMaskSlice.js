import { createSlice } from '@reduxjs/toolkit'

export const maskSlice = createSlice({
  name: "mask",
  initialState: {
    address: null,
    currentContract: null
  },
  reducers: {
    changeMaskAddress: (state, action) => {
        state.address = action.payload;
        state.currentContract = action.payload;
      },
  }
})

export const { changeMaskAddress} = maskSlice.actions
export const selectMaskAddress = (state) => state.mask.address;
export const selectCurrentContract = (state) => state.mask.currentContract;
export default maskSlice.reducer