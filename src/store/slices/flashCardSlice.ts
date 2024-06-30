import axiosInstance from 'src/utils/axios';
import { AppThunk } from '../store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlashCardState {
  data: any;
  loading: boolean;
}

const initialState: FlashCardState = {
  data: [],
  loading: false,
};

const flashCardSlice = createSlice({
  name: 'flashCard',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    flashCardData(state, action: PayloadAction<any>) {
      state.loading = true;
      state.data = action.payload;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const { startLoading, flashCardData, stopLoading } = flashCardSlice.actions;

export default flashCardSlice.reducer;

export const getAllFlashCardForAdmin =
  (page: number, pageSize: number): AppThunk<void> =>
  async (dispatch) => {
    try {
      dispatch(startLoading());
      const response = await axiosInstance.get(
        `/flashcard/getallflashcardsforadmin?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(flashCardData(response.data));
    } catch (error) {
      dispatch(stopLoading(error.message));
    }
  };
