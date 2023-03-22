import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

const devicesApi = createApi({
  reducerPath: "devices",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: ["Devices", "Setting"],
  endpoints(builder) {
    return {
      deleteDevice: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/${input.id}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              password: input.password,
              passwordConfirm: input.passwordConfirm,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateDevice: builder.mutation({
        query: (device) => {
          return {
            url: `/devices/${device._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${device.token}`,
            },
            body: {
              typeID: device.typeID,
              name: device.name,
              firmID: device.firmID,
              firmName: device.firmName,
              ip: device.ip,
              imei: device.imei,
              gsmNo: device.gsmNo,
              serialNo: device.serialNo,
              userPassword: device.userPassword,
              adminPassword: device.adminPassword,
              quota: device.quota,
              counter: device.counter,
              settings: device.settings,
              deviceStatusID: device.deviceStatusID,
              deviceStatusName: device.deviceStatusName,
              isActive: device.isActive,
              note: device.note,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      getQuotaToLoadedCode: builder.query({
        query: (input) => {
          const params = new URLSearchParams({
            id: input.id,
            code: input.code,
            productName: input.productName,
            counter: input.counter,
            quotaToLoaded: input.quotaToLoaded,
          });

          return {
            url: `/devices/loadedQuotaToDevice?${params.toString()}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      dowloadSetting: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/dowloadSetting/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {},
          };
        },
        invalidatesTags: ["Setting"],
      }),
      updateSetting: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/setting/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              settings: input.settings,
            },
          };
        },
        invalidatesTags: ["Setting"],
      }),
      updateDeviceNote: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/note/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              note: input.note,
            },
          };
        },
        invalidatesTags: ["Setting"],
      }),
      updateIP: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/ip/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              ip: input.ip,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateDevicePassword: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/password/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              userPassword: input.userPassword,
              adminPassword: input.adminPassword,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateFirm: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/firm/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              firmID: input.firmID,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateQuota: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/updateQuota`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              id: input.id,
              quota: input.quota,
              productName: input.productName,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateStatus: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/status/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              statusName: input.statusName,
              isActive: input.isActive,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      updateFaultError: builder.mutation({
        query: (input) => {
          return {
            url: `/devices/updateFaultError`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              deviceId: input.deviceId,
              deviceServiceID: input.deviceServiceID,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      getDevice: builder.query({
        query: (input) => {
          return {
            url: `/devices/${input.id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
      }),
      addDevice: builder.mutation({
        query: ({ input, token }) => {
          return {
            url: "/devices",
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              typeID: input.typeID,
              ip: input.ip,
              userPassword: input.userPassword,
              adminPassword: input.adminPassword,
              note: input.note,
            },
          };
        },
        invalidatesTags: ["Devices"],
      }),
      getDeviceByID: builder.query({
        query: ({ token, id }) => {
          return {
            url: `/devices/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
      fetchDevices: builder.query({
        query: (token) => {
          return {
            url: "/devices",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Devices"],
      }),
      fetchSetting: builder.query({
        query: (input) => {
          console.log(input);
          return {
            url: `/devices/setting/${input.id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
          };
        },
        providesTags: ["Setting"],
      }),
    };
  },
});

export const {
  useUpdateDevicePasswordMutation,
  useUpdateFaultErrorMutation,
  useUpdateFirmMutation,
  useUpdateIPMutation,
  useUpdateStatusMutation,
  useUpdateQuotaMutation,
  useFetchDevicesQuery,
  useFetchSettingQuery,
  useAddDeviceMutation,
  useGetDeviceQuery,
  useUpdateDeviceMutation,
  useUpdateSettingMutation,
  useDeleteDeviceMutation,
  useDowloadSettingMutation,
  useGetDeviceByIDQuery,
  useUpdateDeviceNoteMutation,
  useGetQuotaToLoadedCodeQuery,
} = devicesApi;
export { devicesApi };
