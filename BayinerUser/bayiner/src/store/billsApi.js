import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const BillsApi = createApi({
  reducerPath: "bills",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "Bills",
  endpoints(builder) {
    return {
      createBills: builder.mutation({
        query: (Object) => {
          return {
            url: `/bills`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${Object.token}`,
            },
            body: {
              bills: Object.bills,
            },
          };
        },
        invalidatesTags: ["Bills"],
      }),
      controllBills: builder.mutation({
        query: (Object) => {
          return {
            url: `/bills/controll`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${Object.token}`,
            },
            body: {
              bills: Object.bills,
            },
          };
        },
        invalidatesTags: ["Bills"],
      }),
      deleteBill: builder.mutation({
        query: (Object) => {
          return {
            url: `/bills/${Object.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Object.token}`,
            },
          };
        },
        invalidatesTags: ["Bills"],
      }),
      getBills: builder.query({
        query: (input) => {
          return {
            url: `/bills/${input.id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        providesTags: ["Bills"],
      }),
      fetchBills: builder.query({
        query: (token) => {
          return {
            url: "/bills",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Bills"],
      }),
    };
  },
});

export const {
  useFetchBillsQuery,
  useCreateBillsMutation,
  useGetBillsQuery,
  useControllBillsMutation,
  useDeleteBillMutation,
} = BillsApi;
export { BillsApi };
