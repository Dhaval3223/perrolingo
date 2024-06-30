import axiosInstance from 'src/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlashCardState {
  flashCardData: any;
  flashCardDataloading: boolean;
  createFlashDataSuccess: boolean;
  createFlashDataError: boolean;
  createFlashDataLoading: boolean;
  updateFlashDataSuccess: boolean;
  updateFlashDataError: boolean;
  updateFlashDataLoading: boolean;
  deleteFlashDataSuccess: boolean;
  deleteFlashDataError: boolean;
  deleteFlashDataLoading: boolean;
  getFlashCardLikeAndDislikeData: {
    totalLikes: any;
    totalDislikes: any;
  };
}

const initialState: FlashCardState = {
  flashCardData: [],
  flashCardDataloading: false,
  createFlashDataError: false,
  createFlashDataSuccess: false,
  createFlashDataLoading: false,
  updateFlashDataError: false,
  updateFlashDataSuccess: false,
  updateFlashDataLoading: false,
  deleteFlashDataError: false,
  deleteFlashDataSuccess: false,
  deleteFlashDataLoading: false,
  getFlashCardLikeAndDislikeData: {
    totalDislikes: '',
    totalLikes: '',
  },
};

const flashCardSlice = createSlice({
  name: 'flashCard',
  initialState,
  reducers: {
    startFlashCardDataloading(state) {
      state.flashCardDataloading = true;
    },
    flashCardData(state, action: PayloadAction<any>) {
      state.flashCardDataloading = true;
      state.flashCardData = action.payload;
    },
    stopFlashCardDataLoading(state) {
      state.flashCardDataloading = false;
    },
    createFlashDataLoading(state) {
      state.createFlashDataLoading = true;
    },
    createFlashCardDataSuccess(state) {
      state.createFlashDataSuccess = true;
      state.createFlashDataLoading = false;
    },
    createFlashCardDataError(state) {
      state.createFlashDataError = true;
      state.createFlashDataLoading = false;
    },
    updateFlashDataLoading(state) {
      state.updateFlashDataLoading = true;
    },
    updateFlashCardDataSuccess(state) {
      state.updateFlashDataSuccess = true;
      state.updateFlashDataLoading = false;
    },
    updateFlashCardDataError(state) {
      state.updateFlashDataError = true;
      state.updateFlashDataLoading = false;
    },
    deleteFlashDataLoading(state) {
      state.deleteFlashDataLoading = true;
    },
    deleteFlashCardDataSuccess(state) {
      state.deleteFlashDataSuccess = true;
      state.deleteFlashDataLoading = false;
    },
    deleteFlashCardDataError(state) {
      state.deleteFlashDataError = true;
      state.deleteFlashDataLoading = false;
    },
    flashCardLikeAndDislikeData(state, action: PayloadAction<any>) {
      state.flashCardDataloading = true;
      state.getFlashCardLikeAndDislikeData = action.payload;
    },
  },
});

export const {
  startFlashCardDataloading,
  flashCardData,
  stopFlashCardDataLoading,
  createFlashCardDataError,
  createFlashCardDataSuccess,
  createFlashDataLoading,
  updateFlashCardDataError,
  updateFlashCardDataSuccess,
  updateFlashDataLoading,
  deleteFlashCardDataError,
  deleteFlashCardDataSuccess,
  deleteFlashDataLoading,
  flashCardLikeAndDislikeData,
} = flashCardSlice.actions;

export default flashCardSlice.reducer;

export const getAllFlashCardForAdmin =
  (page: number, pageSize: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startFlashCardDataloading());
      const response = await axiosInstance.get(
        `/flashcard/getallflashcardsforadmin?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(flashCardData(response.data));
    } catch (error) {
      dispatch(stopFlashCardDataLoading(error.message));
    }
  };

export const createFlashCardForAdmin =
  (data: any): any =>
  async (dispatch: any) => {
    try {
      dispatch(createFlashDataLoading());
      const response = await axiosInstance.post(`/flashcard`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      dispatch(createFlashCardDataSuccess());
    } catch (error) {
      dispatch(createFlashCardDataError());
    }
  };

export const updateFlashCardForAdmin =
  (data: any, id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(updateFlashDataLoading());
      const response = await axiosInstance.patch(`/flashcard/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      dispatch(updateFlashCardDataSuccess());
    } catch (error) {
      dispatch(updateFlashCardDataError());
    }
  };

export const deleteFlashCardForAdmin =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(deleteFlashDataLoading());
      const response = await axiosInstance.patch(`/flashcard/delete/${id}`); // Replace with your API endpoint
      dispatch(deleteFlashCardDataSuccess());
    } catch (error) {
      dispatch(deleteFlashCardDataError());
    }
  };

export const fetchFlashCardLikeAndDislikeData =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      const response = await axiosInstance.get(`flashcard/getflashcardstats/${id}`); // Replace with your API endpoint
      dispatch(flashCardLikeAndDislikeData(response.data));
    } catch (error) {
      console.log('error', error);
    }
  };
