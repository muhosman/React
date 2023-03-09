import { useFetchSettingQuery, useUpdateSettingMutation } from "../../../store";
import { Blocks } from "react-loader-spinner";
import { AiOutlineUpload } from "react-icons/ai";
import { useState, useEffect } from "react";
import Alerts from "../../../components/Alert";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Confirm from "../../../components/Confirm";
import styles from "../../../CustomStyles";

const UpdateSettings = () => {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const DeviceSetting = useFetchSettingQuery({ token, id });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [updateSetting, resultUpdateSetting] = useUpdateSettingMutation();
  const [settingData, setSettingData] = useState([]);
  const [alert, setAlert] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (alert !== 0) {
      setTimeout(() => {
        setAlert(0);
        setMessage("");
      }, 3000);
    }
  }, [alert]);

  useEffect(() => {
    if (DeviceSetting.status === "fulfilled")
      setSettingData(DeviceSetting?.data?.data?.setting);
  }, [DeviceSetting]);

  const handleApiResponse = (apiResponse, successMessage) => {
    if (apiResponse.isError) {
      setAlert(2);
      setMessage("İşlem başarısız tekrar deneyin !");
      DeviceSetting.refetch({ token, id });
    }
    if (apiResponse.isSuccess) {
      setAlert(1);
      setMessage(successMessage);
      DeviceSetting.refetch({ token, id });
    }
  };

  useEffect(() => {
    handleApiResponse(resultUpdateSetting, "Yeni ayarlar yüklendi !");
  }, [resultUpdateSetting]);

  const handleCloseModel = (boolean) => {
    if (boolean) updateSetting({ settings: settingData, id: id, token: token });
    setShowConfirmModal(false);
  };

  function parseString() {
    return settingData?.map((setting, arrayIndex) => {
      var counterData = 0;
      var counterStartData = 0;
      var paragraphs = [];
      for (var i = 0; i < setting.cupNumber; i++) {
        var p = "Göz-" + (i + 1);
        paragraphs.push(
          <p
            key={i}
            className=" px-1 py-2  text-center font-SemiBold bg-white shadow-lg rounded-md w-full"
          >
            {p}
          </p>
        );
      }
      const CupSetting = setting.cupSettingRow?.map((cupSettingRow) => {
        counterData += setting.cupNumber;
        const CupSetting = (
          <div className="grid sm:grid-rows-2 h-fit py-4 bg-white shadow-lg rounded-md px-2 pb-4">
            <p className={`${styles.tagText} text-center `}>{cupSettingRow}</p>
            <div className=" grid sm:grid-flow-col gap-4">
              {setting.value?.map((Data, index) => {
                if (counterStartData <= index && index < counterData) {
                  return (
                    <>
                      <input
                        name={index}
                        value={Data}
                        className={`${styles.inputTag} text-center`}
                        onChange={(e) => {
                          if (e.target.value <= 100 && e.target.value >= 0) {
                            const newSettingData = [...settingData];
                            const updatedValue = [
                              ...newSettingData[arrayIndex].value,
                            ];
                            updatedValue[e.target.name] = e.target.value;
                            newSettingData[arrayIndex] = {
                              ...newSettingData[arrayIndex],
                              value: updatedValue,
                            }; // create a new object with updated value
                            setSettingData(newSettingData);
                          }
                        }}
                      />
                    </>
                  );
                }
              })}
            </div>
          </div>
        );
        counterStartData += setting.cupNumber;
        return CupSetting;
      });

      const GeneralSetting = setting.generalSettingRow?.map(
        (General, index) => {
          const GeneralSetting = (
            <div className="grid grid-rows-2 justify-center items-center w-fit h-fit bg-white shadow-lg rounded-md px-4 pb-2 ">
              <p className={`${styles.tagText}`}>{General}</p>
              <input
                name={counterData}
                value={setting.value[counterData]}
                className={`${styles.inputTag} text-center`}
                onChange={(e) => {
                  if (e.target.value <= 100 && e.target.value >= 0) {
                    const newSettingData = [...settingData];
                    const updatedValue = [...newSettingData[arrayIndex].value];
                    updatedValue[e.target.name] = e.target.value;
                    newSettingData[arrayIndex] = {
                      ...newSettingData[arrayIndex],
                      value: updatedValue,
                    }; // create a new object with updated value
                    setSettingData(newSettingData);
                  }
                }}
              />
            </div>
          );

          counterData += 1;
          counterStartData += 1;
          return GeneralSetting;
        }
      );

      return (
        <div>
          <p className=" mt-10 font-Bold text-3xl ml-4 border-b-4 border-fourth w-fit tracking-wider">
            {setting.name} Ayarları
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-4 ">
            <div className=" flex flex-col gap-4  p-4">
              <p
                className={`${styles.DesignFieldHeader} text-center w-full border-b-4 border-fourth`}
              >
                {setting.name} Göz Ayarları
              </p>
              <div
                className={`${styles.DesignFieldHeader} text-center flex gap-4`}
              >
                {paragraphs}
              </div>
              <div className="gap-4 grid sm:grid-cols-1 grid-cols-2">
                {CupSetting}
              </div>
            </div>
            <p className=" flex flex-col gap-4  p-4">
              <p
                className={`${styles.DesignFieldHeader} text-center w-full border-b-4 border-fourth`}
              >
                {setting.name} Genel Ayarlar
              </p>
              <div className=" grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-3 gap-4">
                {GeneralSetting}
              </div>
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="sm:px-4">
      {alert !== 0 && (
        <div
          className="fixed z-50 left-1/2 top-0
  -translate-x-1/2"
        >
          <Alerts AlertChoice={alert} message={message} />
        </div>
      )}
      <Confirm
        input={""}
        inputFieldName={""}
        handleCloseModel={handleCloseModel}
        showConfirmModal={showConfirmModal}
      />
      <div className=" grid grid-cols-2 w-fit gap-4">
        {/** 
        <button
          onClick={() => {}}
          className=" lg:text-2xl mb-4 flex items-center transition-all duration-200 active:scale-90  gap-4  w-fit rounded-full bg-fourth text-white p-4"
        >
          Ayarları Çek
          <BsArrowRepeat className=" w-6 h-6" />
        </button>
        */}
        <button
          onClick={() => {
            setShowConfirmModal(true);
          }}
          className={`${styles.button}`}
        >
          Ayarları Yükle
          <AiOutlineUpload className=" w-6 h-6" />
        </button>
      </div>
      {DeviceSetting.isLoading || DeviceSetting.isFetching ? (
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
      ) : DeviceSetting.error || DeviceSetting.data?.result === 0 ? (
        <div className={`${styles.tagText}`}>Ayarlar çekilemedi ! </div>
      ) : (
        <>{parseString()}</>
      )}
    </div>
  );
};

export default UpdateSettings;
