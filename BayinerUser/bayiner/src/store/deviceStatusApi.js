import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const deviceStatusApi = createApi({
  reducerPath: "deviceStatus",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "DeviceStatus",
  endpoints(builder) {
    return {
      deleteDeviceStatus: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceStatuses/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["DeviceStatus"],
      }),
      addDeviceStatus: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceStatuses`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["DeviceStatus"],
      }),
      updateDeviceStatus: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceStatuses/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
            },
          };
        },
        invalidatesTags: ["DeviceStatus"],
      }),
      fetchDeviceStatus: builder.query({
        query: (token) => {
          return {
            url: "/deviceStatuses",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DeviceStatus"],
      }),
    };
  },
});

export const {
  useFetchDeviceStatusQuery,
  useAddDeviceStatusMutation,
  useUpdateDeviceStatusMutation,
  useDeleteDeviceStatusMutation,
} = deviceStatusApi;
export { deviceStatusApi };
