import axiosInstance from 'src/utils/axios';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProposedCardState {
  proposedCardData: {
    count: number;
    rows: any;
  };
  proposedCardDataLoading: boolean;
  proposedCardStatusLoading: boolean;
  proposedCardStatusSuccess: boolean;
  proposedCardStatusError: boolean;
}

const initialState: ProposedCardState = {
  proposedCardData: {
    count: 0,
    rows: [],
  },
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
      state.proposedCardDataLoading = false;
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
    clearStatusData(state) {
      state.proposedCardStatusError = false;
      state.proposedCardStatusSuccess = false;
      state.proposedCardStatusLoading = false;
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
  clearStatusData,
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
      dispatch(getProposedCardData(response.data.data));
    } catch (error) {
      dispatch(stopProposedCardLoading(error.message));
    }
  };

export const changeProposedCardStatus =
  (id: number, data: any): any =>
  async (dispatch: any) => {
    try {
      dispatch(startProposedCardStatusByIdloading());
      await axiosInstance.patch(`/proposedcard/admin/status/${id}`, data); // Replace with your API endpoint
      dispatch(getProposedCardStatusByIdSuccess());
      dispatch(getAllProposedCard(1, 5));
    } catch (error) {
      dispatch(getProposedCardStatusByIdError());
    }
  };
