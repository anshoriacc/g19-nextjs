import { axiosBaseQuery } from '@/api/axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';

export const authQuery = createApi({
  reducerPath: 'authQuery',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ ...data }) => ({
        url: `/auth/register`,
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authQuery;
