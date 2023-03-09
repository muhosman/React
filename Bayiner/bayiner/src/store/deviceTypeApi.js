import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const deviceTypeApi = createApi({
  reducerPath: "deviceTypes",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "DeviceType",
  endpoints(builder) {
    return {
      deleteDeviceType: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceTypes/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["DeviceType"],
      }),
      addDeviceType: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceTypes`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              settingType: input.settingType,
            },
          };
        },
        invalidatesTags: ["DeviceType"],
      }),
      updateDeviceType: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceTypes/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              settingType: input.settingType,
            },
          };
        },
        invalidatesTags: ["DeviceType"],
      }),

      fetchDeviceType: builder.query({
        query: (token) => {
          return {
            url: "/deviceTypes",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DeviceType"],
      }),
    };
  },
});

export const {
  useFetchDeviceTypeQuery,
  useAddDeviceTypeMutation,
  useUpdateDeviceTypeMutation,
  useDeleteDeviceTypeMutation,
  useFetchDeviceTypeByIdQuery,
} = deviceTypeApi;
export { deviceTypeApi };
