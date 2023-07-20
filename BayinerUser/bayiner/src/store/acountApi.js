import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import URL from "../url";
// DEV ONLY!!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const acountApi = createApi({
  reducerPath: "acount",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.url}`,
    fetchFn: async (...args) => {
      // REMOVE FOR PRODUCTION
      return fetch(...args);
    },
  }),
  tagTypes: "Acount",
  endpoints(builder) {
    return {
      updateMyPassword: builder.mutation({ // SALEH: THERE IS SOME ERROR HERE
        query: (input) => {
          return {
            url: `/users/updateMyPassword`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              passwordCurrent: input.passwordCurrent,
              password: input.password,
              passwordConfirm: input.passwordConfirm,
              id: input.id,
            },
          };
        },
        invalidatesTags: ["Acount"],
      }),
      updateMe: builder.mutation({
        query: (input) => {
          return {
            url: `/users/updateMe`,
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${input.token}`,
            },
            body: {
              name: input.name,
              lastName: input.lastName,
              tel: input.tel,
              id: input.id,
            },
          };
        },
        invalidatesTags: ["Acount"],
      }),
      getMe: builder.query({
        query: ({ id, token }) => {
          return {
            url: `/users/me`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
        providesTags: ["Acount"],
      }),
    };
  },
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateMyPasswordMutation,
} = acountApi;
export { acountApi };
