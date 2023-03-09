import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { useGetDeviceByIDQuery } from "../../../store";
import styles from "../../../CustomStyles";

function InfoDevicePage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const ResultDevice = useGetDeviceByIDQuery({ id, token });
  const Data = ResultDevice?.data?.data?.device || [];
  console.log(ResultDevice);
  const [input, setInput] = useState({
    name: "",
    ip: "",
    gsmNo: "",
    serialNo: "",
    imei: "",
    userPassword: "",
    adminPassword: "",
    note: "",
    productInfo: [],
  });

  console.log(input.productInfo);
  useEffect(() => {
    if (ResultDevice.status === "fulfilled") setInput({ ...Data });
  }, [ResultDevice]);

  return (
    <>
      {ResultDevice.isLoading ? (
        <div className=" flex w-full h-full justify-center items-center">
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
            <text className="flex items-center font-SemiBold tracking-wider gap-2 self-center w-full mb-2">
              <p className={`xl:text-2xl md:text-XL text-BASE tracking-wider`}>
                {input.name} Bilgileri
              </p>
              /
              <p className={`xl:text-2xl md:text-XL text-BASE tracking-wider`}>
                Aktiflik:
              </p>
              <span
                className={`${
                  input.isActive ? "bg-sixth" : "bg-fifth"
                } w-6 h-6 text-center ml-3 rounded-full border-2 border-fourth `}
              />
            </text>
            <div className="flex items-center justify-center w-full mb-2">
              <p className={`${styles.DesignFieldHeader} w-full`}>
                Oluşturulma Tarihi :
              </p>
              <p className={`${styles.DesignFieldHeader} w-full`}>
                {input.createdInfo}
              </p>
            </div>
            <div className="flex items-center justify-center w-full mb-2">
              <p className={`${styles.DesignFieldHeader} w-full`}>
                Değiştirilme Tarihi :
              </p>
              <p className={`${styles.DesignFieldHeader} w-full`}>
                {input.updatedInfo}
              </p>
            </div>
          </div>
          <div className=" flex flex-col gap-4 w-full h-full bg-white shadow-md  rounded-lg p-8  transition-all duration-300">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
              {input.ip && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>IP</p>
                  <p className={`${styles.inputTag}`}>{input.ip}</p>
                </div>
              )}
              {input.imei && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Imei</p>
                  <p className={`${styles.inputTag}`}>{input.imei}</p>
                </div>
              )}
              {input.serialNo && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Seri No</p>
                  <p className={`${styles.inputTag}`}>{input.serialNo}</p>
                </div>
              )}
              {input.gsmNo && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>GSM No</p>
                  <p className={`${styles.inputTag}`}>{input.gsmNo}</p>
                </div>
              )}
              {input.userPassword && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Kullanıcı Şifresi</p>
                  <p className={`${styles.inputTag}`}>{input.userPassword}</p>
                </div>
              )}
              {input.adminPassword && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Admin Şifresi</p>
                  <p className={`${styles.inputTag}`}>{input.adminPassword}</p>
                </div>
              )}
              {input.note && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Not</p>
                  <p className={`${styles.inputTag} h-fit`}>{input.note}</p>
                </div>
              )}
            </div>
          </div>
          <>
            <p
              className={`${styles.DesignFieldHeader} max-sm:self-center border-b-4 w-fit border-fourth mt-4`}
            >
              Ürünler
            </p>
            <div className="flex max-sm:flex-col max-sm:items-center md:grid-cols-2 gap-4 mt-4">
              {input.productInfo?.map((item) => {
                return (
                  <div
                    className={`grid w-fit px-12 justify-center relative items-center gap-4 bg-white border-4 border-fourth rounded-md shadow-md shadow-fourth py-4`}
                  >
                    <div
                      className={`${styles.text} absolute top-0 bg-fourth w-full text-center p-4 text-white `}
                    >
                      {item.productName}
                    </div>
                    <p className={`${styles.text} mt-14`}>Kota: {item.quota}</p>
                    <p className={`${styles.text}`}> Sayaç: {item.counter}</p>
                    <p className={`${styles.text}`}>
                      Kritik Seviye : {item.quotaWarning}
                    </p>
                    <p className={`${styles.text}`}>
                      Senkronizasyon Seviyesi: {item.syncLevel}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        </>
      )}
    </>
  );
}

export default InfoDevicePage;
