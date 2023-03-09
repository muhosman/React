import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "Auth",
  endpoints(builder) {
    return {
      forgotPassword: builder.mutation({
        query: (email) => {
          return {
            url: `/users/forgotPassword`,
            method: "POST",
            body: {
              email: email,
            },
          };
        },
      }),
      login: builder.mutation({
        query: ({ email, password }) => {
          return {
            url: `/users/login`,
            method: "POST",
            body: {
              email: email,
              password: password,
            },
          };
        },
      }),
      logout: builder.query({
        query: ({ token }) => {
          return {
            url: `/users/logout`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useForgotPasswordMutation, useLoginMutation, useLogoutQuery } =
  authApi;
export { authApi };
