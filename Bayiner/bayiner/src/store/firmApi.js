import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const firmApi = createApi({
  reducerPath: "firm",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      addFirm: builder.mutation({
        query: (input) => {
          return {
            url: `/firms`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              mainFirmID: input.mainFirmID,
              mainFirmName: input.mainFirmName,
              isCorporate: input.isCorporate,
              officialID: input.officialID,
              taxNumber: input.taxNumber,
              taxOffice: input.taxOffice,
              email: input.email,
              tel: input.tel,
              note: input.note,
              address: input.address,
            },
          };
        },
        invalidatesTags: ["Firm", "Sync", "Device"],
      }),
      updateFirmInfo: builder.mutation({
        query: (input) => {
          return {
            url: `/firms/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              mainFirmID: input.mainFirmID,
              mainFirmName: input.mainFirmName,
              isActive: input.isActive,
              isCorporate: input.isCorporate,
              officialID: input.officialID,
              taxNumber: input.taxNumber,
              taxOffice: input.taxOffice,
              email: input.email,
              tel: input.tel,
              note: input.note,
              address: input.address,
              playMakers: input.playMakers,
            },
          };
        },
        invalidatesTags: ["Firm"],
      }),
      updateFirmSync: builder.mutation({
        query: (input) => {
          return {
            url: `/firms/updateSync/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              productName: input.productName,
              quota: input.quota,
              quotaMax: input.quotaMax,
              quotaWarning: input.quotaWarning,
              syncLevel: input.syncLevel,
            },
          };
        },
        invalidatesTags: ["Sync", "Device", "Firm"],
      }),
      divideQuota: builder.mutation({
        query: (input) => {
          return {
            url: `/firms/divideQuota/${input.id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              productName: input.productName,
            },
          };
        },
        invalidatesTags: ["Sync", "Device", "Firm"],
      }),
      getSyncByFirmID: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/firms/sync/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Sync", "Device"],
      }),
      getDeviceByFirmID: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/firms/devices/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Sync", "Device"],
      }),
      deleteFirmByID: builder.mutation({
        query: (input) => {
          return {
            url: `/firms/${input.id}`,
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
        invalidatesTags: ["Firm"],
      }),
      getFirmByID: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/firms/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Firm"],
      }),
      getBelowFirmsByID: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/firms/belowFirms/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Firm"],
      }),
      getBelongUsersByFirmID: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/firms/belongUsers/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Firm"],
      }),
      fetchFirm: builder.query({
        query: (token) => {
          return {
            url: "/firms",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Firm"],
      }),
    };
  },
});

export const {
  useAddFirmMutation,
  useFetchFirmQuery,
  useGetFirmByIDQuery,
  useGetBelowFirmsByIDQuery,
  useUpdateFirmInfoMutation,
  useUpdateFirmSyncMutation,
  useDeleteFirmByIDMutation,
  useGetBelongUsersByFirmIDQuery,
  useGetDeviceByFirmIDQuery,
  useGetSyncByFirmIDQuery,
  useDivideQuotaMutation,
} = firmApi;
export { firmApi };
