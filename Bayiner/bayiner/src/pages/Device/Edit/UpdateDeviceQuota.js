import { AiOutlineUpload } from "react-icons/ai";
import { ImQrcode } from "react-icons/im";
import styles from "../../../CustomStyles";
import {
  useGetDeviceByIDQuery,
  useGetFirmQuotaByIDQuery,
  useGetQuotaToLoadedCodeQuery,
} from "../../../store";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import DropDown from "../../../components/DropDown";

function UpdateQuota() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const [firmId, setFirmId] = useState(null);
  const [quotaArray, setQuotaArray] = useState([]);

  const [input, setInput] = useState({
    token,
    id: id,
    code: "",
    productName: "",
    counter: 0,
    quotaToLoaded: 0,
    remainingQuota: 0,
    consumentQuota: 0,
  });
  const [key, setKey] = useState(null);
  const [getKey, setGetKey] = useState(false);
  const {
    data: QuotaToLoadedCodeData,
    refetch: QuotaToLoadedCodeRefetch,
    isFetching: QuotaToLoadedCodeIsFetching,
    isLoading: QuotaToLoadedCodeIsLoading,
    isError: QuotaToLoadedCodeIsError,
  } = useGetQuotaToLoadedCodeQuery(input, {
    skip: !getKey,
  });

  const {
    data: DeviceData,
    refetch: DeviceDataRefetch,
    isFetching: DeviceDataIsFetching,
    isLoading: DeviceDataIsLoading,
    isError: DeviceDataIsError,
  } = useGetDeviceByIDQuery(
    { id, token },
    {
      skip: false,
    }
  );

  const {
    data: FirmQuotaData,
    refetch: FirmQuotaDataRefetch,
    isFetching: FirmQuotaDataIsFetching,
    isLoading: FirmQuotaDataIsLoading,
    isError: FirmQuotaDataIsError,
  } = useGetFirmQuotaByIDQuery(
    { id: firmId, token },
    {
      skip: firmId === null,
    }
  );

  useEffect(() => {
    if (
      QuotaToLoadedCodeData &&
      !QuotaToLoadedCodeIsFetching &&
      !QuotaToLoadedCodeIsLoading &&
      !QuotaToLoadedCodeIsError
    ) {
      setGetKey(false);
      setKey(QuotaToLoadedCodeData?.key.toUpperCase());
    }
  }, [
    QuotaToLoadedCodeData,
    QuotaToLoadedCodeIsFetching,
    QuotaToLoadedCodeIsLoading,
    QuotaToLoadedCodeIsError,
  ]);

  useEffect(() => {
    if (
      DeviceData &&
      !DeviceDataIsFetching &&
      !DeviceDataIsLoading &&
      !DeviceDataIsError
    ) {
      setFirmId(DeviceData?.data?.device?.firmID);
    }
  }, [
    DeviceData,
    DeviceDataIsFetching,
    DeviceDataIsLoading,
    DeviceDataIsError,
  ]);

  useEffect(() => {
    if (
      FirmQuotaData &&
      !FirmQuotaDataIsFetching &&
      !FirmQuotaDataIsLoading &&
      !FirmQuotaDataIsError
    ) {
      setQuotaArray(FirmQuotaData?.data?.quotaArray);
    }
  }, [
    FirmQuotaData,
    FirmQuotaDataIsFetching,
    FirmQuotaDataIsFetching,
    FirmQuotaDataIsError,
  ]);

  const deviceProductInfos = DeviceData?.data?.device?.productInfo?.map(
    (item) => {
      return { label: item.productName, value: item.productName };
    }
  );

  const handleSelectProduct = (option) => {
    DeviceData?.data?.device?.productInfo?.map((productInfo) => {
      if (option.value === productInfo.productName) {
        setInput({
          ...input,
          productName: option.value,
        });
      }
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (key !== null) {
      setKey(null);
    }
    if (name === "code") {
      setInput((prevState) => ({
        ...prevState,
        [name]: value.slice(0, 12),
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        [name]: Math.min(parseInt(value) || 0, 10000),
      }));
    }
  };

  const generateCode = () => {
    // Tüm parametrelerin doldurulup doldurulmadığını kontrol et
    if (
      input.id &&
      input.code &&
      input.productName &&
      input.counter >= 0 &&
      input.quotaToLoaded >= 0
    ) {
      setGetKey(true);
    } else {
      // Gerekli parametrelerin doldurulması için kullanıcıya uyarı göster (isteğe bağlı)
      alert("Lütfen tüm alanları doldurunuz.");
    }
  };

  console.log(QuotaToLoadedCodeData);
  return (
    <div className="flex max-md:flex-col self-center bg-white w-fit shadow-xl p-6 gap-4 rounded-xl ">
      <div className=" flex flex-col w-fit p-6 gap-4 rounded-xl">
        <div
          className={`${styles.DesignFieldHeader} text-black text-center border-b-4 w-full border-fourth`}
        >
          Firma Bilgileri
        </div>

        <div className=" flex flex-col px-4 py-2 gap-2 rounded-md">
          <div className=" grid grid-cols-2 items-center gap-4 justify-between rounded-md">
            <p className={`${styles.textTitle}`}>Firma:</p>
            <p className={`${styles.inputTag}`}>
              {DeviceData?.data?.device?.firmName}
            </p>
            {quotaArray.map((item, index) => (
              <>
                <p className={`${styles.textTitle}`}>{item.name} Kota : </p>
                <p className={`${styles.inputTag} text-black`}>{item.quota}</p>
              </>
            ))}
          </div>
        </div>
      </div>
      <div className=" flex flex-col  w-fit p-6 gap-4 rounded-xl">
        <div
          className={`${styles.DesignFieldHeader} text-center border-b-4 w-full border-fourth`}
        >
          Cihaz Kota Yükleme
        </div>

        <div className="flex flex-col items-center justify-between px-4 py-4 rounded-xl gap-4">
          <div className=" grid grid-cols-4 justify-between rounded-xl gap-4">
            <div className="flex flex-col gap-2">
              <p className={`${styles.textTitle} `}>Ürün</p>
              <DropDown
                options={deviceProductInfos}
                value={{
                  label: input.productName,
                  value: input.productName,
                }}
                DropDownPanel={styles.DropDownPanel}
                text={styles.DropDownText}
                onChange={handleSelectProduct}
                search={false}
                barValue={"Durum"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className={`${styles.textTitle} `}>Cihaz Kodu</p>
              <input
                name="code"
                value={input.code}
                className={`${styles.inputTag} text-center`}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className={`${styles.textTitle} `}>Sayaç</p>
              <input
                name="counter"
                value={input.counter}
                className={`${styles.inputTag} text-center`}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className={`${styles.textTitle}`}>Yüklenecek Kota</p>
              <input
                name="quotaToLoaded"
                value={input.quotaToLoaded}
                className={`${styles.inputTag} text-center`}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <input
              value={key}
              disabled
              className={` text-center rounded-xl p-2 w-fit cursor-pointer bg-green-200`}
            />
          </div>
          <button
            className={`${styles.button} w-fit py-4`}
            onClick={generateCode}
          >
            <p className=" ">Kod Üret</p>
            <ImQrcode
              className={`${styles.buttonIcon} ${true ? "animate-spin" : ""}`}
            />
          </button>
          {key !== null && (
            <div className="flex flex-col items-center justify-between px-4 py-4 rounded-xl gap-4">
              <div className="grid grid-cols-3">
                <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                  <p className={`${styles.textTitle} text-center`}>
                    Kalan Kota
                  </p>
                  <input
                    value={430}
                    className={`${styles.inputTag} text-center`}
                    disabled
                  />
                </div>
                <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                  <p className={`${styles.textTitle} text-center`}>Sayaç</p>
                  <input
                    value={240}
                    className={`${styles.inputTag} text-center`}
                    disabled
                  />
                </div>
                <div className=" flex flex-col gap-2 items-center justify-center  px-4 py-2 rounded-full">
                  <p className={`${styles.textTitle} text-center`}>
                    Yüklenecek Kota
                  </p>
                  <input
                    value={0}
                    className={`${styles.inputTag} text-center`}
                    disabled
                  />
                </div>
              </div>
              <button className={`${styles.button} w-fit py-4`}>
                <p>Kota Yükle</p>
                <AiOutlineUpload className={`${styles.buttonIcon}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateQuota;
