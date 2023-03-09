import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const StockApi = createApi({
  reducerPath: "stock",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "Stock",
  endpoints(builder) {
    return {
      updateStock: builder.mutation({
        query: (input) => {
          return {
            url: `/stock/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              quota: input.quota,
            },
          };
        },
        invalidatesTags: ["Stock"],
      }),
      fetchStock: builder.query({
        query: (token) => {
          return {
            url: "/stock",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Stock"],
      }),
    };
  },
});

export const { useFetchStockQuery, useUpdateStockMutation } = StockApi;
export { StockApi };
