import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { RxCrossCircled } from "react-icons/rx";
import { useGetFirmByIDQuery } from "../../../store";
import styles from "../../../CustomStyles";

function InfoFirmPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const ResultMainFirm = useGetFirmByIDQuery({ id, token });
  const Data = ResultMainFirm?.data?.data?.firm || [];
  const [input, setInput] = useState({
    name: "",
    mainFirmID: "",
    mainFirmName: "",
    isActive: "",
    officialID: "",
    taxNumber: "",
    taxOffice: "",
    isCorporate: "",
    tel: "",
    email: "",
    address: { city: "", town: "", text: "" },
    playMakers: [],
  });

  console.log(ResultMainFirm);
  useEffect(() => {
    if (ResultMainFirm.status === "fulfilled") setInput({ ...Data });
  }, [ResultMainFirm]);

  return (
    <>
      {ResultMainFirm.isLoading ? (
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

          <div className=" flex flex-col gap-4 bg-white shadow-md  rounded-lg  p-8 h-full transition-all duration-300">
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
              {input.officialID && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>TC No</p>
                  <p className={`${styles.inputTag}`}>{input.officialID}</p>
                </div>
              )}
              {input.taxNumber && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Vergi Numarası</p>
                  <p className={`${styles.inputTag}`}>{input.taxNumber}</p>
                </div>
              )}
              {input.taxOffice && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Vergi Dairesi</p>
                  <p className={`${styles.inputTag}`}>{input.taxOffice}</p>
                </div>
              )}
              {input.tel && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Telefon Numarası</p>
                  <p className={`${styles.inputTag}`}>{input.tel}</p>
                </div>
              )}
              {input.email && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Email</p>
                  <p className={`${styles.inputTag}`}>{input.email}</p>
                </div>
              )}
              {input.address && input.address.city && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Şehir</p>
                  <p className={`${styles.inputTag}`}>{input.address.city}</p>
                </div>
              )}
              {input.address && input.address.town && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>İlçe</p>
                  <p className={`${styles.inputTag}`}>{input.address.town}</p>
                </div>
              )}
            </div>
            <div className=" grid sm:grid-cols-2 grid-cols-1 gap-10 h-fit">
              {input.address && input.address.text && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Adres</p>
                  <p className={`${styles.inputTag} h-fit`}>
                    {input.address.text}
                  </p>
                </div>
              )}
              {input.note && (
                <div className="flex flex-col justify-between">
                  <p className={`${styles.tagText} mb-3`}>Not</p>
                  <p className={`${styles.inputTag} h-fit`}>{input.note}</p>
                </div>
              )}
            </div>
            <div className=" grid lg:grid-cols-2 grid-cols-1 gap-10 h-fit">
              <div className=" grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 pr-16 items-center">
                {input?.playMakers?.map((item) => {
                  return (
                    <div className="bg-slate-200 rounded-xl p-2 text-center relative h-fit lg:mt-6 mt-0">
                      <p className=" break-words py-2">{item.name}</p>
                      <span class="flex h-5 w-5 absolute -top-1 -right-1">
                        <span class="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                        <div
                          onClick={() => {
                            const updatedPlaymakers = input?.playMakers?.filter(
                              (index) => index.name !== item.name
                            );
                            setInput({
                              ...input,
                              playMakers: updatedPlaymakers,
                            });
                          }}
                          className="cursor-pointer"
                        >
                          <RxCrossCircled className=" relative inline-flex rounded-full h-5 w-5 bg-sky-500 active:bg-fifth" />
                        </div>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default InfoFirmPage;
