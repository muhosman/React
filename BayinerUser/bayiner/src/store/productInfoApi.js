import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const productInfoApi = createApi({
  reducerPath: "productInfo",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: ["ProductInfo"],
  endpoints(builder) {
    return {
      deleteProductInfo: builder.mutation({
        query: (input) => {
          return {
            url: `/productInfoes/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["ProductInfo"],
      }),
      addProductInfo: builder.mutation({
        query: (input) => {
          return {
            url: `/productInfoes`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              typeName: input.typeName,
              code: input.code,
            },
          };
        },
        invalidatesTags: ["ProductInfo"],
      }),
      updateProductInfo: builder.mutation({
        query: (input) => {
          return {
            url: `/productInfoes/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              typeName: input.typeName,
              code: input.code,
            },
          };
        },
        invalidatesTags: ["ProductInfo"],
      }),
      fetchProductInfo: builder.query({
        query: (token) => {
          return {
            url: "/productInfoes",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["ProductInfo"],
      }),
    };
  },
});

export const {
  useFetchProductInfoQuery,
  useAddProductInfoMutation,
  useUpdateProductInfoMutation,
  useDeleteProductInfoMutation,
} = productInfoApi;

export { productInfoApi };
