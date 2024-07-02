import axiosInstance from 'src/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { number } from 'yup';

interface CourseState {
  courseData: {
    count: number;
    rows: any;
  };
  courseDataloading: boolean;
  courseWithFlashcardData: {
    count: number;
    rows: any;
  };
  courseWithFlashcardDataLoading: any;
  fetchCourseData: any;
  fetchCourseDataLoading: boolean;
  fetchCourseDataSuccess: boolean;
  fetchCourseDataError: boolean;
  createCourseSuccess: boolean;
  createCourseError: boolean;
  createCourseLoading: boolean;
  updateCourseSuccess: boolean;
  updateCourseError: boolean;
  updateCourseLoading: boolean;
  deleteCourseSuccess: boolean;
  deleteCourseError: boolean;
  deleteCourseLoading: boolean;
}

const initialState: CourseState = {
  courseData: {
    count: 0,
    rows: [],
  },
  courseDataloading: false,
  courseWithFlashcardData: {
    count: 0,
    rows: [],
  },
  courseWithFlashcardDataLoading: false,
  fetchCourseData: {},
  fetchCourseDataError: false,
  fetchCourseDataLoading: false,
  fetchCourseDataSuccess: false,
  createCourseError: false,
  createCourseSuccess: false,
  createCourseLoading: false,
  updateCourseError: false,
  updateCourseSuccess: false,
  updateCourseLoading: false,
  deleteCourseError: false,
  deleteCourseSuccess: false,
  deleteCourseLoading: false,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    startCourseloading(state) {
      state.courseDataloading = true;
    },
    getCourseData(state, action: PayloadAction<any>) {
      state.courseDataloading = false;
      state.courseData = action.payload;
    },
    stopCourseLoading(state) {
      state.courseDataloading = false;
    },
    startCourseWithFlashcardloading(state) {
      state.courseWithFlashcardDataLoading = true;
    },
    getCourseWithFlashcardData(state, action: PayloadAction<any>) {
      state.courseWithFlashcardDataLoading = false;
      state.courseWithFlashcardData = action.payload;
    },
    stopCourseWithFlashcardLoading(state) {
      state.courseWithFlashcardDataLoading = false;
    },
    startCourseByIdloading(state) {
      state.fetchCourseDataLoading = true;
    },
    getCourseByIdData(state, action: PayloadAction<any>) {
      state.fetchCourseDataLoading = false;
      state.fetchCourseData = action.payload;
    },
    stopCourseByIdLoading(state) {
      state.fetchCourseDataLoading = false;
    },
    createCourseLoading(state) {
      state.createCourseLoading = true;
    },
    createCourseSuccess(state) {
      state.createCourseSuccess = true;
      state.createCourseLoading = false;
    },
    createCourseError(state) {
      state.createCourseError = true;
      state.createCourseLoading = false;
    },
    updateCourseLoading(state) {
      state.updateCourseLoading = true;
    },
    updateCourseSuccess(state) {
      state.updateCourseSuccess = true;
      state.updateCourseLoading = false;
    },
    updateCourseError(state) {
      state.updateCourseError = true;
      state.updateCourseLoading = false;
    },
    deleteCourseLoading(state) {
      state.deleteCourseLoading = true;
    },
    deleteCourseSuccess(state) {
      state.deleteCourseSuccess = true;
      state.deleteCourseLoading = false;
    },
    deleteCourseError(state) {
      state.deleteCourseError = true;
      state.deleteCourseLoading = false;
    },
  },
});

export const {
  startCourseloading,
  getCourseData,
  stopCourseLoading,
  createCourseError,
  createCourseSuccess,
  createCourseLoading,
  updateCourseError,
  updateCourseSuccess,
  updateCourseLoading,
  deleteCourseError,
  deleteCourseSuccess,
  deleteCourseLoading,
  getCourseWithFlashcardData,
  startCourseWithFlashcardloading,
  stopCourseWithFlashcardLoading,
  getCourseByIdData,
  startCourseByIdloading,
  stopCourseByIdLoading,
} = courseSlice.actions;

export default courseSlice.reducer;

export const getAllCourses =
  (page: number, pageSize: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startCourseloading());
      const response = await axiosInstance.get(
        `/course/admin/course?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(getCourseData(response.data.data));
    } catch (error) {
      dispatch(stopCourseLoading(error.message));
    }
  };

export const createCourse =
  (data: any): any =>
  async (dispatch: any) => {
    try {
      dispatch(createCourseLoading());
      await axiosInstance.post(`/course`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      dispatch(createCourseSuccess());
    } catch (error) {
      dispatch(createCourseError());
    }
  };

export const updateCourse =
  (data: any, id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(updateCourseLoading());
      await axiosInstance.patch(`/course/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Replace with your API endpoint
      dispatch(updateCourseSuccess());
      dispatch(getAllCourseWithFlashcard(1, 5));
    } catch (error) {
      dispatch(updateCourseError());
    }
  };

export const getAllCourseWithFlashcard =
  (page: number, pageSize: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startCourseWithFlashcardloading());
      const response = await axiosInstance.get(
        `/course/admin/courseflashcard?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(getCourseWithFlashcardData(response.data.data));
    } catch (error) {
      dispatch(stopCourseWithFlashcardLoading(error.message));
    }
  };

export const getCourseById =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startCourseByIdloading());
      const response = await axiosInstance.get(`/course/admin/${id}`); // Replace with your API endpoint
      dispatch(getCourseByIdData(response.data));
    } catch (error) {
      dispatch(stopCourseByIdLoading(error.message));
    }
  };

export const deleteCourse =
  (id: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(deleteCourseLoading());
      await axiosInstance.patch(`/course/delete/${id}`); // Replace with your API endpoint
      dispatch(deleteCourseSuccess());
      dispatch(getAllCourseWithFlashcard(1, 5));
    } catch (error) {
      dispatch(deleteCourseError());
    }
  };
