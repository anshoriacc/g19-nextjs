import { axiosBaseQuery } from '@/api/axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';

export const profileQuery = createApi({
  reducerPath: 'profileQuery',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ accessToken, data }) => ({
        url: `/profile`,
        method: 'PATCH',
        accessToken,
        data,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = profileQuery;
