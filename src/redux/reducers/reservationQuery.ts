import { axiosBaseQuery } from '@/api/axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';

export const reservationQuery = createApi({
  reducerPath: 'reservationQuery',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Reservation'],
  endpoints: (builder) => ({
    getReservationList: builder.query({
      query: ({ accessToken, type, status, sortBy, limit, page = 1 }) => ({
        url: `/reservation`,
        method: 'GET',
        accessToken,
        params: { type, status, sortBy, limit, page },
      }),
      transformResponse: (response) => ({
        data: response.data.map((el, index) => ({
          ...el,
          number: index + 1,
        })),
        meta: response.meta,
      }),
      providesTags: [{ type: 'Reservation', id: 'LIST' }],
    }),
    getReservationDetail: builder.query({
      query: ({ accessToken, reservationId }) => ({
        url: `/reservation/${reservationId}`,
        method: 'GET',
        accessToken,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result ? [{ type: 'Reservation', id: result.id }] : null,
    }),
    addReservation: builder.mutation({
      query: ({ accessToken, ...data }) => ({
        url: `/reservation`,
        method: 'POST',
        accessToken,
        data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: 'Reservation', id: 'LIST' }],
    }),
    updateReservation: builder.mutation({
      query: ({ accessToken, reservationId, ...data }) => ({
        url: `/reservation/${reservationId}`,
        method: 'PATCH',
        accessToken,
        data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Reservation', id: arg.id },
        { type: 'Reservation', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetReservationListQuery,
  useGetReservationDetailQuery,
  useAddReservationMutation,
  useUpdateReservationMutation,
} = reservationQuery;
