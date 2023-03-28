import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const DashBoardApi = createApi({
  reducerPath: "dashBoardDevice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "DashBoardDevice",
  endpoints(builder) {
    return {
      getDashBoard: builder.query({
        query: (token) => {
          return {
            url: "/dashBoard",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DashBoardDevice"],
      }),
      getFirstFiveFirms: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            day: input.day,
          });

          return {
            url: `/dashBoard/firstFiveFirms?${params.toString()}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      getGeneralInfo: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            day: input.day,
          });

          return {
            url: `/dashBoard/generalInfo?${params.toString()}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
    };
  },
});

export const {
  useGetDashBoardQuery,
  useGetFirstFiveFirmsQuery,
  useGetGeneralInfoQuery,
} = DashBoardApi;
export { DashBoardApi };
