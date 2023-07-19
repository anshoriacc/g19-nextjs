import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    createReservationData: (state, { payload }) => {
      const {
        type,
        startDate,
        endDate,
        total,
        payment,
        addOn,
        vehicleId,
        tourId,
      } = payload;

      return {
        ...state,
        type: type ?? state?.type,
        startDate: startDate ?? state?.startDate,
        endDate: endDate ?? state?.endDate,
        total: total ?? state?.total,
        payment: payment ?? state?.payment,
        addOn: addOn ?? state?.addOn,
        vehicleId: vehicleId ?? state?.vehicleId,
        tourId: tourId ?? state?.tourId,
      };
    },
    clearReservationData: () => initialState,
  },
});

export const { createReservationData, clearReservationData } =
  reservationSlice.actions;

export default reservationSlice.reducer;
