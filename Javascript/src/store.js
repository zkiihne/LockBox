import { configureStore } from '@reduxjs/toolkit'
import maskReducer from './ConnectMetaMaskSlice'

export default configureStore({
  reducer: {
    mask: maskReducer
  }
})