import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import flashCardReducer from './slices/flashCardSlice';

// Configure Redux store with combined reducers
const store = configureStore({
  reducer: {
     flashCard: flashCardReducer,
    // Add more reducers as needed
  },
});

// Define RootState type to infer state structure
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
