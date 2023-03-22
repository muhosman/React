import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { devicesApi } from "./devicesApi";
import { deviceLogApi } from "./deviceLogApi";

import { deviceTypeApi } from "./deviceTypeApi";
import { deviceSettingApi } from "./deviceSettingApi";
import { deviceStatusApi } from "./deviceStatusApi";
import { deviceServiceApi } from "./deviceServiceApi";
import { usersApi } from "./usersApi";
import { cityApi } from "./cityApi";
import { townApi } from "./townApi";
import { gsmApi } from "./gsmApi";
import { firmApi } from "./firmApi";
import { productInfoApi } from "./productInfoApi";
import { productTypeApi } from "./productTypeApi";
import { authApi } from "./authApi";
import { acountApi } from "./acountApi";
import { StockApi } from "./stockApi";
import { BillsApi } from "./billsApi";
import { DashBoardDeviceApi } from "./dashboardDeviceApi";

export const store = configureStore({
  reducer: {
    [deviceLogApi.reducerPath]: deviceLogApi.reducer,
    [DashBoardDeviceApi.reducerPath]: DashBoardDeviceApi.reducer,
    [BillsApi.reducerPath]: BillsApi.reducer,
    [StockApi.reducerPath]: StockApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [acountApi.reducerPath]: acountApi.reducer,
    [gsmApi.reducerPath]: gsmApi.reducer,
    [firmApi.reducerPath]: firmApi.reducer,
    [devicesApi.reducerPath]: devicesApi.reducer,
    [deviceTypeApi.reducerPath]: deviceTypeApi.reducer,
    [deviceStatusApi.reducerPath]: deviceStatusApi.reducer,
    [deviceServiceApi.reducerPath]: deviceServiceApi.reducer,
    [deviceSettingApi.reducerPath]: deviceSettingApi.reducer,
    [productInfoApi.reducerPath]: productInfoApi.reducer,
    [productTypeApi.reducerPath]: productTypeApi.reducer,
    [townApi.reducerPath]: townApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(deviceLogApi.middleware)
      .concat(DashBoardDeviceApi.middleware)
      .concat(BillsApi.middleware)
      .concat(StockApi.middleware)
      .concat(authApi.middleware)
      .concat(acountApi.middleware)
      .concat(firmApi.middleware)
      .concat(deviceSettingApi.middleware)
      .concat(gsmApi.middleware)
      .concat(deviceServiceApi.middleware)
      .concat(usersApi.middleware)
      .concat(productInfoApi.middleware)
      .concat(productTypeApi.middleware)
      .concat(usersApi.middleware)
      .concat(devicesApi.middleware)
      .concat(deviceTypeApi.middleware)
      .concat(townApi.middleware)
      .concat(cityApi.middleware)
      .concat(deviceStatusApi.middleware);
  },
});

setupListeners(store.dispatch);
export { useFetchGSMQuery } from "./gsmApi";

export { useGetDashBoardDeviceQuery } from "./dashboardDeviceApi";

export {
  useGetDeviceLogQuery,
  useGetDeviceLogReportQuery,
} from "./deviceLogApi";

export {
  useFetchBillsQuery,
  useCreateBillsMutation,
  useGetBillsQuery,
  useControllBillsMutation,
  useDeleteBillMutation,
} from "./billsApi";

export { useFetchStockQuery, useUpdateStockMutation } from "./stockApi";

export {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutQuery,
} from "./authApi";

export {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateMyPasswordMutation,
} from "./acountApi";

export {
  useAddFirmMutation,
  useFetchFirmQuery,
  useGetFirmByIDQuery,
  useGetBelowFirmsByIDQuery,
  useUpdateFirmInfoMutation,
  useUpdateFirmSyncMutation,
  useDivideQuotaMutation,
  useDeleteFirmByIDMutation,
  useGetBelongUsersByFirmIDQuery,
  useGetDeviceByFirmIDQuery,
  useGetSyncByFirmIDQuery,
  useGetFirmQuotaByIDQuery,
} from "./firmApi";

export {
  useFetchProductInfoQuery,
  useAddProductInfoMutation,
  useUpdateProductInfoMutation,
  useDeleteProductInfoMutation,
} from "./productInfoApi";
export {
  useFetchProductTypeQuery,
  useAddProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} from "./productTypeApi";

export {
  useFetchUserQuery,
  useFetchPlayMakerQuery,
  useAddUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserByIDMutation,
} from "./usersApi";
export {
  useFetchCityQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} from "./cityApi";
export {
  useFetchTownQuery,
  useAddTownMutation,
  useUpdateTownMutation,
  useDeleteTownMutation,
} from "./townApi";
export {
  useFetchDeviceStatusQuery,
  useAddDeviceStatusMutation,
  useUpdateDeviceStatusMutation,
  useDeleteDeviceStatusMutation,
} from "./deviceStatusApi";
export {
  useFetchDeviceTypeQuery,
  useAddDeviceTypeMutation,
  useUpdateDeviceTypeMutation,
  useDeleteDeviceTypeMutation,
  useFetchDeviceTypeByIdQuery,
} from "./deviceTypeApi";

export {
  useFetchDeviceSettingQuery,
  useAddDeviceSettingMutation,
  useUpdateDeviceSettingMutation,
  useDeleteDeviceSettingMutation,
  useGetDeviceSettingByTypeIDQuery,
} from "./deviceSettingApi";
export {
  useFetchDeviceServiceQuery,
  useAddDeviceServiceMutation,
  useUpdateDeviceServiceMutation,
  useDeleteDeviceServiceMutation,
} from "./deviceServiceApi";

export {
  useFetchDevicesQuery,
  useFetchSettingQuery,
  useAddDeviceMutation,
  useGetDeviceQuery,
  useDeleteDeviceMutation,
  useUpdateDeviceMutation,
  useUpdateSettingMutation,
  useUpdateQuotaMutation,
  useUpdateDevicePasswordMutation,
  useUpdateFirmMutation,
  useUpdateIPMutation,
  useDowloadSettingMutation,
  useUpdateStatusMutation,
  useGetDeviceByIDQuery,
  useUpdateDeviceNoteMutation,
  useUpdateFaultErrorMutation,
  useGetQuotaToLoadedCodeQuery,
} from "./devicesApi";
