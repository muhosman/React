import { useState, useEffect, useRef } from "react";
import Alerts from "../../../components/Alert";
import { TbEdit, TbArrowAutofitWidth } from "react-icons/tb";
import useAuth from "../../../hooks/useAuth";
import PaginationBar from "../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import styles from "../../../CustomStyles";
import { useParams } from "react-router-dom";
import {
  useDivideQuotaMutation,
  useGetSyncByFirmIDQuery,
  useUpdateFirmSyncMutation,
} from "../../../store";
import Confirm from "../../../components/Confirm";

const DatasPage = function () {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const responseDatas = useGetSyncByFirmIDQuery({ id, token });
  const [inputFieldName, setInputFieldName] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [input, setInput] = useState({
    productName: "",
    quota: 0,
    quotaWarning: 0,
    quotaMax: 0,
    price: 0,
    syncLevel: 0,
    id: id,
    token: token,
  });

  const [paginationNumber, setPaginationNumber] = useState(1);

  const inputRefQuotaWarning = useRef(null);
  const inputRefQuotaMax = useRef(null);
  const inputRefPrice = useRef(null);
  const inputRefSyncLevel = useRef(null);

  const [inputFocus, setInputFocus] = useState("productName");
  const [update, resultUpdate] = useUpdateFirmSyncMutation();
  const [divideQuota, resultDivideQuota] = useDivideQuotaMutation();

  const [confirm, setConfirm] = useState(false);
  const [designModel, setDesignModel] = useState(false);
  const [action, setAction] = useState(0); // 1- add 2-update 3-delete 0- default
  const [alert, setAlert] = useState(0); // 1- success 2-error 3-warning
  const [message, setMessage] = useState("");

  const Datas = responseDatas.data?.data?.productInfoes || [];
  const quota = responseDatas.data?.data?.quotaArray || [];

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 5000);
    }
  }, [alert]);

  const handleApiResponse = (apiResponse, successMessage) => {
    if (apiResponse.isError) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
      setInput((prevInput) => ({
        ...prevInput,
        token: token,
      }));
    }
    if (apiResponse.isSuccess) {
      setAlert(1);
      setMessage(successMessage);
      window.location.reload();
    }
  };

  useEffect(() => {
    handleApiResponse(resultUpdate, "Senkronizasyon bilgileri güncellendi !");
  }, [resultUpdate]);
  useEffect(() => {
    handleApiResponse(resultDivideQuota, "Kota dağıtımı başarılı !");
  }, [resultDivideQuota]);
  const handleModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
    setDesignModel(false);
  };

  const handleCloseModel = (boolean) => {
    if (boolean) {
      if (action === 1) {
        update(input);
        setAction(0);
        setInput({
          productName: "",
          quota: 0,
          quotaWarning: 0,
          quotaMax: 0,
          price: 0,
          syncLevel: 0,
          token: token,
        });
        setShowConfirmModal(false);
      } else if (action === 2) {
        divideQuota(input);
        setShowConfirmModal(false);
      }
    } else {
      setShowConfirmModal(false);
    }
  };

  const handleChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
    setInputFocus(event.target.name);
  };

  const inputRefs = {
    quotaMax: inputRefQuotaMax,
    quotaWarning: inputRefQuotaWarning,
    price: inputRefPrice,
    syncLevel: inputRefSyncLevel,
  };

  useEffect(() => {
    const inputRef = inputRefs[inputFocus];
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputFocus]);

  const DesignModel = () => {
    return (
      <form onSubmit={handleModal} className=" flex flex-col gap-6 min-w-max  ">
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white`}
        >
          Cihaz Senkronizasyon Ayarları
        </div>
        <div className="flex flex-col gap-6 min-w-max px-8 pb-4">
          <div className=" flex flex-col gap-4">
            <text className={` ${styles.textTitle}`}>
              Ürün İsmi: {input.productName}
            </text>
          </div>
          <div className=" flex flex-col gap-4">
            <text className={` ${styles.textTitle}`}>Kota: {input.quota}</text>
          </div>
          <div className=" flex flex-col gap-4">
            <text className={` ${styles.textTitle}`}>
              Tehlikeli Kota Seviyesi:
            </text>
            <input
              className={`${styles.inputTag}`}
              id="quotaWarning"
              type="text"
              name="quotaWarning"
              ref={inputRefQuotaWarning}
              value={input.quotaWarning || 0}
              placeholder={"Tehlikeli Kota"}
              maxLength="6"
              required
              onInput={handleChange}
            />
          </div>
          <div className=" flex flex-col gap-4">
            <text className={` ${styles.textTitle}`}>
              Maximum Kota Seviyesi:
            </text>
            <input
              className={`${styles.inputTag}`}
              id="quotaMax"
              type="text"
              name="quotaMax"
              ref={inputRefQuotaMax}
              value={input.quotaMax || 0}
              placeholder={"Maximum Kota"}
              maxLength="6"
              required
              onInput={handleChange}
            />
          </div>

          <div className=" flex flex-col gap-4">
            <text className={` ${styles.textTitle}`}>
              Senkronizasyon Seviyesi:
            </text>
            <input
              className={`${styles.inputTag}`}
              id="syncLevel"
              type="text"
              name="syncLevel"
              ref={inputRefSyncLevel}
              value={input.syncLevel || 0}
              placeholder={"Senkronizasyon Seviyesi"}
              maxLength="6"
              required
              onInput={handleChange}
            />
          </div>

          <button
            onClick={() => {}}
            className={`${styles.buttonSearch}  
          px-6 py-3 w-fit self-center`}
          >
            Kaydet
          </button>
        </div>
      </form>
    );
  };

  const filteredDatas = Datas?.filter((Datas, index) => {
    if (
      index >= paginationNumber * 10 - 10 &&
      index <= paginationNumber * 10 - 1
    )
      return Datas;
  });

  const content = filteredDatas?.map((Datas) => {
    return (
      <div
        className={`bg-white shadow-md shadow-black rounded-xl transition-all relative w-full`}
      >
        <div
          className={`${styles.cardTitle} text-center w-full p-4 rounded-t-xl bg-fourth text-white `}
        >
          <p>Tanımlanmış Cihaz Senkronizasyon Bilgisi</p>
        </div>
        <div className=" p-10 ">
          <div className=" flex flex-col gap-4">
            <div>
              <text className={`${styles.textTitle}`}>
                Kullanılacak Ürün İsmi:
              </text>
              <text className={`${styles.text} `}>{Datas.productName}</text>
            </div>
            <div>
              <text className={`${styles.textTitle} `}>Kota: </text>
              <text className={`${styles.text} `}>
                {quota.map((item) => {
                  if (item.name === Datas.productName)
                    return parseInt(item.quota) + parseInt(Datas.quota);
                })}
              </text>
            </div>
            <div>
              <text className={`${styles.textTitle} `}>Dağıtılmamış Kota:</text>
              <text className={`${styles.text} `}>{Datas.quota}</text>
            </div>
            <div>
              <text className={`${styles.textTitle} `}>
                Kota Tehlike Seviyesi:
              </text>
              <text className={`${styles.text} `}>{Datas.quotaWarning}</text>
            </div>
            <div>
              <text className={`${styles.textTitle} `}>
                Kota Maximum Seviyesi:
              </text>
              <text className={`${styles.text} `}>{Datas.quotaMax}</text>
            </div>

            <div>
              <text className={`${styles.textTitle} `}>
                Senkronizasyon Seviyesi:
              </text>
              <text className={`${styles.text}`}>{Datas.syncLevel}</text>
            </div>
          </div>
          <div className=" flex gap-4 items-center justify-center mt-10">
            <div className=" rounded-md border-2 border-fourth w-fit p-[4px]">
              <TbEdit
                onClick={() => {
                  setInput({
                    ...input,
                    productName: Datas.productName,
                    quota: Datas.quota,
                    quotaWarning: Datas.quotaWarning,
                    quotaMax: Datas.quotaMax,
                    syncLevel: Datas.syncLevel,
                    token: token,
                    id: id,
                  });
                  setDesignModel(true);
                  setAction(1);
                }}
                className=" w-8 h-8 rounded-md border-2 border-fourth hover:text-slate-400 hover:border-slate-400 text-fourth cursor-pointer"
              />
            </div>
            <div className="rounded-md border-2 border-fourth w-fit p-[4px]">
              <TbArrowAutofitWidth
                onClick={() => {
                  setInput({
                    ...input,
                    productName: Datas.productName,
                    token: token,
                    id: id,
                  });
                  setShowConfirmModal(true);
                  setAction(2);
                }}
                className=" w-8 h-8 rounded-md border-2 border-fourth hover:text-slate-400 hover:border-slate-400 text-fourth cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className={` mb-20 flex flex-col md:mr-10 md:ml-0 mx-10`}>
      {alert !== 0 && (
        <div
          className="fixed z-10 left-1/2 top-0
  -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <Confirm
        input={input}
        inputFieldName={inputFieldName}
        handleCloseModel={handleCloseModel}
        showConfirmModal={showConfirmModal}
      />
      {responseDatas.isLoading || responseDatas.isFetching ? (
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
      ) : responseDatas.isError || Datas?.length === 0 ? (
        <div className=" text-SemiBold">
          Senkronizasyon ayarları bulunamadı !
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <PaginationBar
              elements={Datas}
              info="Bu bilgilerde bir cihaz bulunamadı."
              paginationNumber={paginationNumber}
              setPaginationNumber={setPaginationNumber}
            />
          </div>
          <div className=" grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-6 ">
            <>{content}</>
          </div>
        </>
      )}
      {designModel && (
        <>
          <div
            onClick={() => {
              setInput({
                productName: "",
                quota: 0,
                quotaWarning: 0,
                quotaMax: 0,
                syncLevel: 0,
              });
              setConfirm(false);
              setDesignModel(false);
              setAction(0);
            }}
            className="fixed inset-0 z-40 bg-gray-300 opacity-80 "
          ></div>
          <div
            className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl 
          -translate-x-1/2  w-fit ${confirm ? "h-fit" : " h-[41rem]"}`}
          >
            <div
              className=" bg-white flex flex-col justify-center rounded-xl
          items-center w-fit h-fit"
            >
              {designModel && <DesignModel />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatasPage;
