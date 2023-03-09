import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const deviceSettingApi = createApi({
  reducerPath: "deviceSettings",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "DeviceSetting",
  endpoints(builder) {
    return {
      deleteDeviceSetting: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceSettings/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        invalidatesTags: ["DeviceSetting"],
      }),
      addDeviceSetting: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceSettings`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              productName: input.productName,
              quota: input.quota,
              quotaMax: input.quotaMax,
              quotaWarning: input.quotaWarning,
              price: input.price,
              syncLevel: input.syncLevel,
              cupSettingRow: input.cupSettingRow,
              generalSettingRow: input.generalSettingRow,
            },
          };
        },
        invalidatesTags: ["DeviceSetting"],
      }),
      updateDeviceSetting: builder.mutation({
        query: (input) => {
          return {
            url: `/deviceSettings/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              productName: input.productName,
              quota: input.quota,
              quotaMax: input.quotaMax,
              quotaWarning: input.quotaWarning,
              price: input.price,
              syncLevel: input.syncLevel,
              cupSettingRow: input.cupSettingRow,
              generalSettingRow: input.generalSettingRow,
            },
          };
        },
        invalidatesTags: ["DeviceSetting"],
      }),
      fetchDeviceSettingById: builder.query({
        query: (input) => {
          return {
            url: `/deviceSettings/${input.typeID}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      fetchDeviceSetting: builder.query({
        query: (token) => {
          return {
            url: "/deviceSettings",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["DeviceSetting"],
      }),
    };
  },
});

export const {
  useFetchDeviceSettingQuery,
  useAddDeviceSettingMutation,
  useUpdateDeviceSettingMutation,
  useDeleteDeviceSettingMutation,
  useGetDeviceSettingByTypeIDQuery,
} = deviceSettingApi;
export { deviceSettingApi };
