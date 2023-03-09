import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const deviceServiceApi = createApi({
  reducerPath: "deviceService",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "DeviceService",
  endpoints(builder) {
    return {
      deleteDeviceService: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceServices/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["DeviceService"],
      }),
      addDeviceService: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceServices`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              type: input.type,
              info: input.info,
              deviceSettingID: input.deviceSettingID,
              serviceCode: input.serviceCode,
              solutionStep: input.solutionStep,
            },
          };
        },
        invalidatesTags: ["DeviceService"],
      }),
      updateDeviceService: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceServices/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              type: input.type,
              info: input.info,
              deviceSettingID: input.deviceSettingID,
              serviceCode: input.serviceCode,
              solutionStep: input.solutionStep,
            },
          };
        },
        invalidatesTags: ["DeviceService"],
      }),
      fetchDeviceService: builder.query({
        query: (token) => {
          return {
            url: "/deviceServices",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DeviceService"],
      }),
    };
  },
});

export const {
  useFetchDeviceServiceQuery,
  useAddDeviceServiceMutation,
  useUpdateDeviceServiceMutation,
  useDeleteDeviceServiceMutation,
} = deviceServiceApi;
export { deviceServiceApi };
