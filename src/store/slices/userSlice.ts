import axiosInstance from 'src/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  usersData: any;
  usersDataloading: boolean;
  getUserData: any;
  getUserDataLoading: boolean;
  fetchUserData: any;
  fetchUserDataLoading: boolean;
  fetchUserDataSuccess: boolean;
  fetchUserDataError: boolean;
  updateFlashCardSuccess: boolean;
  updateFlashCardError: boolean;
  updateFlashCardLoading: boolean;
  deleteUserSuccess: boolean;
  deleteUserError: boolean;
  deleteUserLoading: boolean;
  deleteFlashCardSuccess: boolean;
  deleteFlashCardError: boolean;
  deleteFlashCardLoading: boolean;
}

const initialState: UserState = {
  usersData: [],
  usersDataloading: false,
  getUserData: {},
  getUserDataLoading: false,
  fetchUserData: {},
  fetchUserDataError: false,
  fetchUserDataLoading: false,
  fetchUserDataSuccess: false,
  updateFlashCardError: false,
  updateFlashCardSuccess: false,
  updateFlashCardLoading: false,
  deleteUserError: false,
  deleteUserSuccess: false,
  deleteUserLoading: false,
  deleteFlashCardSuccess: false,
  deleteFlashCardError: false,
  deleteFlashCardLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startUserloading(state) {
      state.usersDataloading = true;
    },
    getUserData(state, action: PayloadAction<any>) {
      state.usersDataloading = true;
      state.usersData = action.payload;
    },
    stopUserLoading(state) {
      state.usersDataloading = false;
    },
    startGetUserloading(state) {
      state.getUserDataLoading = true;
    },
    getUserMyData(state, action: PayloadAction<any>) {
      state.getUserDataLoading = true;
      state.getUserData = action.payload;
    },
    stopGetUserLoading(state) {
      state.getUserDataLoading = false;
    },
    startUserByIdloading(state) {
      state.fetchUserDataLoading = true;
    },
    getUserByIdData(state, action: PayloadAction<any>) {
      state.fetchUserDataLoading = false;
      state.fetchUserData = action.payload;
    },
    stopUserByIdLoading(state) {
      state.fetchUserDataLoading = false;
    },
    updateFlashcardByIdLoading(state) {
      state.updateFlashCardLoading = true;
    },
    updateFlashcardByIdSuccess(state) {
      state.updateFlashCardSuccess = true;
      state.updateFlashCardLoading = false;
    },
    updateFlashcardByIdError(state) {
      state.updateFlashCardError = true;
      state.updateFlashCardLoading = false;
    },
    deleteUserLoading(state) {
      state.deleteUserLoading = true;
    },
    deleteUserSuccess(state) {
      state.deleteUserSuccess = true;
      state.deleteUserLoading = false;
    },
    deleteUserError(state) {
      state.deleteUserError = true;
      state.deleteUserLoading = false;
    },
    deleteFlashCardByIdLoading(state) {
      state.deleteFlashCardLoading = true;
    },
    deleteFlashCardByIdSuccess(state) {
      state.deleteFlashCardSuccess = true;
      state.deleteFlashCardLoading = false;
    },
    deleteFlashCardByIdError(state) {
      state.deleteFlashCardError = true;
      state.deleteFlashCardLoading = false;
    },
  },
});

export const {
  startUserloading,
  getUserData,
  stopUserLoading,
  updateFlashcardByIdError,
  updateFlashcardByIdLoading,
  updateFlashcardByIdSuccess,
  deleteUserError,
  deleteUserSuccess,
  deleteUserLoading,
  getUserByIdData,
  startUserByIdloading,
  stopUserByIdLoading,
  getUserMyData,
  startGetUserloading,
  stopGetUserLoading,
  deleteFlashCardByIdError,
  deleteFlashCardByIdLoading,
  deleteFlashCardByIdSuccess,
} = userSlice.actions;

export default userSlice.reducer;

export const getAllUsers =
  (page: number, pageSize: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startUserloading());
      const response = await axiosInstance.get(
        `/admins/getalluser?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(getUserData(response.data));
    } catch (error) {
      dispatch(stopUserLoading(error.message));
    }
  };

export const getUser = (): any => async (dispatch: any) => {
  try {
    dispatch(startGetUserloading());
    const response = await axiosInstance.get(`/users/getuser`); // Replace with your API endpoint
    dispatch(getUserMyData(response.data));
  } catch (error) {
    dispatch(stopGetUserLoading(error.message));
  }
};

export const updateFlashCardById =
  (data: any, id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(updateFlashcardByIdLoading());
      const response = await axiosInstance.patch(`/flashcard/updateflashcardbyid/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      dispatch(updateFlashcardByIdSuccess());
    } catch (error) {
      dispatch(updateFlashcardByIdError());
    }
  };

export const getUserById =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startUserByIdloading());
      const response = await axiosInstance.get(`/users/${id}`); // Replace with your API endpoint
      dispatch(getUserByIdData(response.data));
    } catch (error) {
      dispatch(stopUserByIdLoading(error.message));
    }
  };

export const deleteUser =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(deleteUserLoading());
      const response = await axiosInstance.patch(`/admins/deleteuser/${id}`); // Replace with your API endpoint
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserError());
    }
  };

export const deleteFlashCardById =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(deleteFlashCardByIdLoading());
      const response = await axiosInstance.patch(`/flashcard/deleteflashcardbyid/${id}`); // Replace with your API endpoint
      dispatch(deleteFlashCardByIdSuccess());
    } catch (error) {
      dispatch(deleteFlashCardByIdError());
    }
  };
