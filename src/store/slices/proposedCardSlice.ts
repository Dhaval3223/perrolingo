import axiosInstance from 'src/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProposedCardState {
  proposedCardData: any;
  proposedCardDataLoading: boolean;
  proposedCardStatusLoading: boolean;
  proposedCardStatusSuccess: boolean;
  proposedCardStatusError: boolean;
}

const initialState: ProposedCardState = {
  proposedCardData: [],
  proposedCardDataLoading: false,
  proposedCardStatusError: false,
  proposedCardStatusLoading: false,
  proposedCardStatusSuccess: false,
};

const ProposedCardSlice = createSlice({
  name: 'proposedCard',
  initialState,
  reducers: {
    startProposedCardloading(state) {
      state.proposedCardDataLoading = true;
    },
    getProposedCardData(state, action: PayloadAction<any>) {
      state.proposedCardDataLoading = true;
      state.proposedCardData = action.payload;
    },
    stopProposedCardLoading(state) {
      state.proposedCardDataLoading = false;
    },
    startProposedCardStatusByIdloading(state) {
      state.proposedCardStatusLoading = true;
    },
    getProposedCardStatusByIdSuccess(state) {
      state.proposedCardStatusLoading = false;
      state.proposedCardStatusSuccess = true;
    },
    getProposedCardStatusByIdError(state) {
      state.proposedCardStatusLoading = false;
      state.proposedCardStatusError = true;
    },
  },
});

export const {
  startProposedCardloading,
  stopProposedCardLoading,
  getProposedCardData,
  getProposedCardStatusByIdSuccess,
  startProposedCardStatusByIdloading,
  getProposedCardStatusByIdError,
} = ProposedCardSlice.actions;

export default ProposedCardSlice.reducer;

export const getAllProposedCard =
  (page: number, pageSize: number): any =>
  async (dispatch: any) => {
    try {
      dispatch(startProposedCardloading());
      const response = await axiosInstance.get(
        `/proposedcard/admin?page=${page}&pageSize=${pageSize}`
      ); // Replace with your API endpoint
      dispatch(getProposedCardData(response.data));
    } catch (error) {
      dispatch(stopProposedCardLoading(error.message));
    }
  };

export const changeProposedCardStatus =
  (id: number, data: any): any =>
  async (dispatch: any) => {
    try {
      dispatch(startProposedCardStatusByIdloading());
      const response = await axiosInstance.patch(`/proposedcard/admin/status/${id}`, { data }); // Replace with your API endpoint
      dispatch(getProposedCardStatusByIdSuccess());
    } catch (error) {
      dispatch(getProposedCardStatusByIdError());
    }
  };
