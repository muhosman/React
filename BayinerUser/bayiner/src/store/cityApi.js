import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const cityApi = createApi({
  reducerPath: "city",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      deleteCity: builder.mutation({
        query: (input) => {
          return {
            url: `/city/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["City"],
      }),
      addCity: builder.mutation({
        query: (input) => {
          return {
            url: `/city`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["City"],
      }),
      updateCity: builder.mutation({
        query: (input) => {
          return {
            url: `/city/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["City"],
      }),
      fetchCity: builder.query({
        query: (token) => {
          return {
            url: "/city",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["City"],
      }),
    };
  },
});

export const {
  useFetchCityQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi;
export { cityApi };
