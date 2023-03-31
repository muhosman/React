import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const firmLogApi = createApi({
  reducerPath: "firmLog",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: ["FirmLog"],
  endpoints(builder) {
    return {
      getFirmLogStatistic: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            id: input.id,
            createdInfo: input.createdInfo,
            data: input.data,
          });

          return {
            url: `/firmLog?${params.toString()}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      getFirmLogReport: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            id: input.id,
            createdInfo: input.createdInfo,
            createdInfoSecond: input.createdInfoSecond,
            data: input.data,
          });

          return {
            url: `/firmLog/report?${params.toString()}`,
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

export const { useGetFirmLogStatisticQuery, useGetFirmLogReportQuery } =
  firmLogApi;
export { firmLogApi };
