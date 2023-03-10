import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const DashBoardDeviceApi = createApi({
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
      getDashBoardDevice: builder.query({
        query: (token) => {
          return {
            url: "/dashBoardDevice",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DashBoardDevice"],
      }),
    };
  },
});

export const { useGetDashBoardDeviceQuery } = DashBoardDeviceApi;
export { DashBoardDeviceApi };
