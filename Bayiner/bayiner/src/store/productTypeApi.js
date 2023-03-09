import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const productTypeApi = createApi({
  reducerPath: "productType",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "ProductType",
  endpoints(builder) {
    return {
      deleteProductType: builder.mutation({
        query: (input) => {
          return {
            url: `/productTypes/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["ProductType"],
      }),
      addProductType: builder.mutation({
        query: (input) => {
          return {
            url: `/productTypes`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["ProductType"],
      }),
      updateProductType: builder.mutation({
        query: (input) => {
          return {
            url: `/productTypes/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["ProductType"],
      }),
      fetchProductType: builder.query({
        query: (token) => {
          return {
            url: "/productTypes",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["ProductType"],
      }),
    };
  },
});

export const {
  useFetchProductTypeQuery,
  useAddProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypeApi;
export { productTypeApi };
