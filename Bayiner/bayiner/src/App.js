import DashBoardPage from "./pages/DashBoardPage";
import FaultErrorPage from "./pages/FaultErrorPage";
// Device Pages
import DevicePage from "./pages/Device/DevicePage.js";
import CreateDevicePage from "./pages/Device/CreateDevicePage";
import EditDevicePage from "./pages/Device/EditDevicePage";
import UpdateDeviceInfo from "./pages/Device/Edit/UpdateDeviceInfo";
import UpdateDeviceQuota from "./pages/Device/Edit/UpdateDeviceQuota";
import UpdateDeviceSetting from "./pages/Device/Edit/UpdateDeviceSettings";
import DeleteDevice from "./pages/Device/Edit/DeleteDevice";
import InfoDevicePage from "./pages/Device/InfoDevicePage";
import InfoDevice from "./pages/Device/Info/InfoDevice";
import DetailDevice from "./pages/Device/Info/DetailDevice";
import ReportDevice from "../src/pages/Device/Info/ReportDevice";
//Firma pages
import FirmPage from "./pages/Firm/FirmPage";
import CreateFirmPage from "./pages/Firm/CreateFirmPage.js";
import EditFirmPage from "./pages/Firm/EditFirmPage.js";
import UpdateFirmInfo from "./pages/Firm/Edit/UpdateInfo.js";
import UpdateFirmBill from "./pages/Firm/Edit/UpdateBill.js";
import ControlFirm from "./pages/Firm/Edit/ControlFirms.js";
import ControlDevice from "./pages/Firm/Edit/ControlDevice.js";
import DeleteFirm from "./pages/Firm/Edit/Delete.js";
import InfoFirmPage from "./pages/Firm/InfoFirmPage.js";
import InfoFirm from "./pages/Firm/Info/InfoFirm";
import DetailFirm from "./pages/Firm/Info/DetailFirm";
import ReportFirm from "./pages/Firm/Info/ReportFirm";

//Users
import Users from "./pages/Firm/Edit/Users.js";
import CreateUserPage from "./pages/User/CreateUserPage";
import EditUserPage from "./pages/User/EditUserPage";
import UpdateUserInfo from "./pages/User/Edit/UpdateInfo";
import DeleteUser from "./pages/User/Edit/Delete";

import ProfilePage from "./pages/ProfilePage";
import OrderPage from "./pages/OrderPage";
import DeliveryPage from "./pages/DeliveryPage";
import StockPage from "./pages/StockPage";
import BillPage from "./pages/BillPage";
import UsersPage from "./pages/User/UsersPage";
import ReportPage from "./pages/ReportPage";
import DeviceTypePage from "./pages/parameters/Device/Type/DeviceTypePage";
import DeviceServicePage from "./pages/parameters/Device/Service/DeviceServicePage";
import DeviceStatusPage from "./pages/parameters/Device/Status/DeviceStatusPage";
import DeviceSettingPage from "./pages/parameters/Device/Setting/DeviceSettingPage";
import ProductInfoPage from "./pages/parameters/Product/Info/ProductInfoPage";
import TownPage from "./pages/parameters/Utils/TownPage";
import CityPage from "./pages/parameters/Utils/CityPage";
import ProductTypePage from "./pages/parameters/Product/Type/ProductTypePage.js";
import LoginPage from "./pages/LoginPage/LoginPage.js";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import SiteLayout from "./components/Layout/SiteLayout";
import FirmLayout from "./components/Layout/FirmLayout.js";
import DeviceLayout from "./components/Layout/DeviceLayout";
import UserLayout from "./components/Layout/UserLayout";
import Page404 from "./pages/Page404";

const ROLES = {
  Management: "management",
  Admin: "admin",
  Accounting: "accounting",
  Manufacture: "manufacture",
  Playmaker: "playmaker",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<LoginPage />} />
      </Route>

      <Route
        element={
          <RequireAuth
            allowedRoles={[
              ROLES.Admin,
              ROLES.Management,
              ROLES.Accounting,
              ROLES.Manufacture,
              ROLES.Playmaker,
            ]}
          />
        }
      >
        <Route path="Anasayfa" element={<SiteLayout />}>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Accounting,
                  ROLES.Manufacture,
                  ROLES.Playmaker,
                ]}
              />
            }
          >
            <Route path="Profil" element={<ProfilePage />} />
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Management]} />
            }
          >
            <Route path="Dashboard" element={<DashBoardPage />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Manufacture,
                ]}
              />
            }
          >
            <Route path="FaultError" element={<FaultErrorPage />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Accounting,
                  ROLES.Manufacture,
                ]}
              />
            }
          >
            <Route path="Cihaz" element={<DeviceLayout />}>
              <Route index={true} element={<DevicePage />} />
              <Route path="Oluştur" element={<CreateDevicePage />} />
              <Route path="Bilgi/:id" element={<InfoDevicePage />}>
                <Route path="Genel" element={<InfoDevice />} />
                <Route path="İstatistik" element={<DetailDevice />} />
                <Route path="Rapor" element={<ReportDevice />} />
              </Route>
              <Route path="Düzenle/:id" element={<EditDevicePage />}>
                <Route path="Bilgi" element={<UpdateDeviceInfo />} />
                <Route path="Ayar" element={<UpdateDeviceSetting />} />
                <Route path="Kota" element={<UpdateDeviceQuota />} />
                <Route path="Sil" element={<DeleteDevice />} />
              </Route>
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Admin, ROLES.Management, ROLES.Accounting]}
              />
            }
          >
            <Route path="Firma" element={<FirmLayout />}>
              <Route index={true} element={<FirmPage />} />
              <Route path="Oluştur" element={<CreateFirmPage />} />
              <Route path="Bilgi/:id" element={<InfoFirmPage />}>
                <Route path="Genel" element={<InfoFirm />} />
                <Route path="İstatistik" element={<DetailFirm />} />
                <Route path="Rapor" element={<ReportFirm />} />
              </Route>
              <Route path="Düzenle/:id" element={<EditFirmPage />}>
                <Route path="Bilgi" element={<UpdateFirmInfo />} />
                <Route path="Fatura" element={<UpdateFirmBill />} />
                <Route path="Firmalar" element={<ControlFirm />} />
                <Route path="Cihazlar" element={<ControlDevice />} />
                <Route path="Kullanıcılar" element={<Users />} />
                <Route path="Sil" element={<DeleteFirm />} />
              </Route>
            </Route>
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Management]} />
            }
          >
            <Route path="Sipariş" element={<OrderPage />} />
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Management]} />
            }
          >
            <Route path="Teslimat" element={<DeliveryPage />} />
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Manufacture,
                ]}
              />
            }
          >
            <Route path="Stok" element={<StockPage />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Admin, ROLES.Management, ROLES.Accounting]}
              />
            }
          >
            <Route path="Fatura" element={<BillPage />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.Admin, ROLES.Management, ROLES.Accounting]}
              />
            }
          >
            <Route path="Kullanıcı" element={<UserLayout />}>
              <Route index={true} element={<UsersPage />} />
              <Route path="Oluştur" element={<CreateUserPage />} />
              <Route path="Düzenle/:id" element={<EditUserPage />}>
                <Route path="Bilgi" element={<UpdateUserInfo />} />
                <Route path="Sil" element={<DeleteUser />} />
              </Route>
            </Route>
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Admin,
                  ROLES.Management,
                  ROLES.Accounting,
                  ROLES.Manufacture,
                ]}
              />
            }
          >
            <Route path="Rapor" element={<ReportPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="CihazTipi" element={<DeviceTypePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="CihazAyarı" element={<DeviceSettingPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="CihazDurumu" element={<DeviceStatusPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="CihazBilgisi" element={<ProductInfoPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="ÜrünTipi" element={<ProductTypePage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="İlçe" element={<TownPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="Şehir" element={<CityPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="CihazServis" element={<DeviceServicePage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
