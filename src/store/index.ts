import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import imagesReducer from "./reducers/imagesReducer";
import contractReducer from "./reducers/contractReducer";

const store = configureStore({
  reducer: {
    images: imagesReducer,
    contract: contractReducer,
  },
  middleware: [thunkMiddleware],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export { useAppDispatch, useAppSelector } from "./hooks";

export default store;
