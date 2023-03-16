import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const deviceLogApi = createApi({
  reducerPath: "deviceLog",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: ["DeviceLog"],
  endpoints(builder) {
    return {
      getDeviceLog: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            id: input.id,
            createdInfo: input.createdInfo,
            data: input.data,
          });

          return {
            url: `/deviceLog?${params.toString()}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      getDeviceLogReport: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            id: input.id,
            createdInfo: input.createdInfo,
            createdInfoSecond: input.createdInfoSecond,
            data: input.data,
          });

          return {
            url: `/deviceLog/report?${params.toString()}`,
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

export const { useGetDeviceLogQuery, useGetDeviceLogReportQuery } =
  deviceLogApi;
export { deviceLogApi };
