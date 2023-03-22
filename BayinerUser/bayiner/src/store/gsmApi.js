import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const gsmApi = createApi({
  reducerPath: "gsm",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      fetchGSM: builder.query({
        query: (token) => {
          return {
            url: "/devices/gsm",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
    };
  },
});

export const { useFetchGSMQuery } = gsmApi;
export { gsmApi };
