import { axiosBaseQuery } from '@/api/axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';

export const bannerQuery = createApi({
  reducerPath: 'bannerQuery',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Banner'],
  endpoints: (builder) => ({
    getBannerList: builder.query({
      query: ({ accessToken }) => ({
        url: `/banner`,
        method: 'GET',
        accessToken,
      }),
      transformResponse: (response) => response.data,
      providesTags: [{ type: 'Banner', id: 'LIST' }],
    }),
    addBanner: builder.mutation({
      query: ({ accessToken, ...data }) => ({
        url: `/banner`,
        method: 'POST',
        accessToken,
        data,
      }),
      transformResponse: (response) =>
        response.data.map((el, index) => ({
          ...el,
          number: index + 1,
        })),
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }],
    }),
    updateBanner: builder.mutation({
      query: ({ accessToken, bannerId, ...data }) => ({
        url: `/banner/${bannerId}`,
        method: 'PATCH',
        accessToken,
        data,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }],
    }),
    deleteBanner: builder.mutation({
      query: ({ accessToken, bannerId }) => ({
        url: `/banner/${bannerId}`,
        method: 'DELETE',
        accessToken,
      }),
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBannerListQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerQuery;
