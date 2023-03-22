import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const townApi = createApi({
  reducerPath: "Town",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      deleteTown: builder.mutation({
        query: (input) => {
          return {
            url: `/town/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["Town"],
      }),
      addTown: builder.mutation({
        query: (input) => {
          return {
            url: `/town`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["Town"],
      }),
      updateTown: builder.mutation({
        query: (input) => {
          return {
            url: `/town/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["Town"],
      }),
      fetchTown: builder.query({
        query: (token) => {
          return {
            url: "/town",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Town"],
      }),
    };
  },
});

export const {
  useFetchTownQuery,
  useAddTownMutation,
  useUpdateTownMutation,
  useDeleteTownMutation,
} = townApi;
export { townApi };
