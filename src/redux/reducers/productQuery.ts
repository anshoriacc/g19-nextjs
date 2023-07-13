import { axiosBaseQuery } from '@/api/axios';
import { createApi } from '@reduxjs/toolkit/dist/query/react';

export const productQuery = createApi({
  reducerPath: 'productQuery',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: ({
        type,
        q,
        sortBy,
        minPrice,
        maxPrice,
        limit = 10,
        page = 1,
      }) => ({
        url: `/product/${type}`,
        method: 'GET',
        params: { q, sortBy, minPrice, maxPrice, limit, page },
      }),
      transformResponse: (response) => ({
        data: response.data.map((el, index) => ({
          ...el,
          number: index + 1,
        })),
        meta: response.meta,
      }),
      providesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    getProductDetail: builder.query({
      query: ({ type, productId, sDate, eDate }) => ({
        url: `/product/${type}/${productId}`,
        method: 'GET',
        params: { sDate, eDate },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result ? [{ type: 'Product', id: result.id }] : null,
    }),
    addProduct: builder.mutation({
      query: ({ accessToken, type, formdata, data }) => ({
        url: `/product/${type}`,
        method: 'POST',
        accessToken,
        data,
        formdata,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ accessToken, type, productId, formdata, data }) => ({
        url: `/product/${type}/${productId}`,
        method: 'PATCH',
        accessToken,
        data,
        formdata,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation({
      query: ({ accessToken, type, productId }) => ({
        url: `/product/${type}/${productId}`,
        method: 'DELETE',
        accessToken,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductListQuery,
  useGetProductDetailQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productQuery;
