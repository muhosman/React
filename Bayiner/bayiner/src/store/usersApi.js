import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";

// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: ["User"],
  endpoints(builder) {
    return {
      addUser: builder.mutation({
        query: (input) => {
          return {
            url: "/users",
            method: "POST",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              role: input.role,
              firmID: input.firmID,
              firmName: input.firmName,
              name: input.name,
              lastName: input.lastName,
              email: input.email,
              tel: input.tel,
            },
          };
        },
        invalidatesTags: ["User"],
      }),
      getUser: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/users/${id}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
      updateUser: builder.mutation({
        query: (input) => {
          return {
            url: `/users/${input._id}`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              role: input.role,
              firmID: input.firmID,
              firmName: input.firmName,
              name: input.name,
              lastName: input.lastName,
              email: input.email,
              tel: input.tel,
              isActive: input.isActive,
            },
          };
        },
        invalidatesTags: ["User"],
      }),
      deleteUserByID: builder.mutation({
        query: (input) => {
          return {
            url: `/users/${input.id}`,
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
        invalidatesTags: ["User"],
      }),
      fetchUser: builder.query({
        query: (token) => {
          return {
            url: "/users",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["User"],
      }),
    };
  },
});

export const {
  useFetchUserQuery,
  useAddUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserByIDMutation,
} = usersApi;
export { usersApi };
