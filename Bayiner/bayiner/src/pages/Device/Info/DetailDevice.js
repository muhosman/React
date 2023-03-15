import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { useGetDeviceByIDQuery, useGetDeviceLogQuery } from "../../../store";
import styles from "../../../CustomStyles";
import Graph from "../../../components/Graph/DashboardBar";
import PieChartGraph from "../../../components/Graph/PieChartGraph";
import Calendar from "react-calendar";
import DropDown from "../../../components/DropDown";
import styled from "styled-components";

import { BsCalendarWeekFill } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";

function DetailDevice() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();
  const day = new Date()?.getDate().toString().padStart(2, "0");
  const month = (new Date()?.getMonth() + 1).toString().padStart(2, "0");
  const year = new Date()?.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const [input, setInput] = useState({
    id: id,
    token: token,
    data: "consument",
    createdInfo: formattedDate,
  });

  const [date, setDate] = useState(new Date());
  const [getLog, setGetLog] = useState(false);
  const [dir, setDir] = useState(false);
  const [detailDir, setDetailDir] = useState(false);
  const reportType = [
    { name: "Tüketim" },
    { name: "Ayar Değişikliği" },
    { name: "Bilgi Deiğişikliği" },
    { name: "Hata" },
    { name: "Arıza" },
    { name: "Manuel Yükleme" },
  ];
  const [detailReport, setDetailReport] = useState("");
  const [calendar, setCalendar] = useState(false);
  const responseDevice = useGetDeviceByIDQuery({ id: id, token: token });
  const Datas = responseDevice?.data?.data?.device || [];
  const response = useGetDeviceLogQuery(input);

  const error = [];
  const fault = [];

  function findAndUpdate(arr, item) {
    const foundIndex = arr.findIndex(
      (el) => el.name === item.name && el.color === item.color
    );

    if (foundIndex !== -1) {
      arr[foundIndex].value += item.value;
    } else {
      arr.push(item);
    }
  }

  Datas.errors?.forEach((err) => {
    const errorItem = {
      name: err.info,
      value: err.amount,
      color: getColorByServiceCode(err.serviceCode),
    };
    findAndUpdate(error, errorItem);
  });

  Datas.faults?.forEach((flt) => {
    const faultItem = {
      name: flt.info,
      value: flt.amount,
      color: getColorByServiceCode(flt.serviceCode),
    };
    findAndUpdate(fault, faultItem);
  });

  // Helper function to get color based on serviceCode
  function getColorByServiceCode(serviceCode) {
    // You can define the mapping between serviceCode and color here
    const colorMapping = {
      400: "#004080",
      300: "#5F8D4E",
      // Add other serviceCode-color pairs as needed
    };

    return colorMapping[serviceCode] || "#000000"; // Default color if serviceCode not found in the mapping
  }

  const handleGetLogData = () => {};

  const ProductData = [
    {
      name: "Ocak",
      Çay: 4000,
      Kahve: 2400,
      FiltreKahve: 3400,
    },
    {
      name: "Şubat",
      Çay: 3000,
      Kahve: 1398,
      FiltreKahve: 1200,
    },
    {
      name: "Mart",
      Çay: 2000,
      Kahve: 9800,
      FiltreKahve: 6000,
    },
    {
      name: "Nisan",
      Çay: 2780,
      Kahve: 3908,
      FiltreKahve: 3130,
    },
    {
      name: "Mayıs",
      Çay: 1890,
      Kahve: 4800,
      FiltreKahve: 3240,
    },
    {
      name: "Haziran",
      Çay: 2390,
      Kahve: 3800,
      FiltreKahve: 3130,
    },
  ];
  const ProductBars = [
    { dataKey: "Çay", fill: "#5F8D4E" },
    { dataKey: "Kahve", fill: "#6d4a3a" },
    { dataKey: "FiltreKahve", fill: "#00407d" },
  ];

  const detailReportOptions = reportType?.map((item) => {
    return { label: item.name, value: item.name };
  });
  const handleSelectReport = (option) => {
    reportType?.map((item) => {
      if (option.value === item.name) {
        setDetailReport({
          name: item.name,
        });
      }
    });
  };

  const onChangeDate = (date) => {
    // tarih değerlerini ayrıştırın
    const day = date?.getDate().toString().padStart(2, "0");
    const month = (date?.getMonth() + 1).toString().padStart(2, "0");
    const year = date?.getFullYear();

    // "gg.aa.yyyy" formatında bir tarih dizesi oluşturun
    const formattedDate = `${day}.${month}.${year}`;
    setInput({ ...input, createdInfo: formattedDate });
    setDate(date);
  };

  const CalendarContainer = styled.div`
    /* ~~~ container styles ~~~ */
    /* ... */

    /* ~~~ navigation styles ~~~ */
    .react-calendar__navigation {
      display: flex;

      .react-calendar__navigation__label {
        font-weight: bold;
      }

      .react-calendar__navigation__arrow {
        flex-grow: 0.333;
      }
    }
    /* ~~~ label styles ~~~ */
    .react-calendar__month-view__weekdays {
      text-align: center;
    }
    /* ~~~ button styles ~~~ */
    button {
      margin: 3px;
      background-color: #004080;
      border: 0;
      border-radius: 3px;
      color: white;
      padding: 10px 24px;
      border: 3px solid #004080;

      &:hover {
        background-color: #ffff;
        color: #004080;
        border: 3px solid #004080;
      }

      &:active {
        background-color: #a5c1a5;
      }
    }
    /* ~~~ day grid styles ~~~ */
    .react-calendar__month-view__days {
      display: grid !important;
      grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;
      .react-calendar__tile {
        max-width: initial !important;
      }
    }
    /* ~~~ neighboring month & weekend styles ~~~ */
    .react-calendar__month-view__days__day--neighboringMonth {
      opacity: 0.7;
    }
    .react-calendar__month-view__days__day--weekend {
      color: #ffff;
    }
    /* ~~~ active day styles ~~~ */
    .react-calendar__tile--range {
      box-shadow: 0 0 10px 6px white;
    }
    /* ~~~ other view styles ~~~ */
    .react-calendar__year-view__months,
    .react-calendar__decade-view__years,
    .react-calendar__century-view__decades {
      display: grid !important;
      grid-template-columns: 20% 20% 20% 20% 20%;

      &.react-calendar__year-view__months {
        grid-template-columns: 33.3% 33.3% 33.3%;
      }

      .react-calendar__tile {
        max-width: initial !important;
      }
    }
  `;

  return (
    <>
      {false ? (
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
          {dir ? (
            <>
              <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
                <text className="flex max-md:flex-col md:items-center gap-8 self-center w-full mb-2">
                  <div className=" flex items-center gap-2 self-center  mb-2">
                    <MdOutlineKeyboardArrowLeft
                      onClick={() => [setDir(false)]}
                      className={`${styles.buttonIcon} cursor-pointer active:-ml-4 active:mr-4 transition-all duration-300`}
                    />
                    <p className={`${styles.DesignFieldHeader}`}>Raporlar</p>
                    <MdOutlineKeyboardArrowRight
                      onClick={() => [setDir(true)]}
                      className={`${styles.buttonIcon} cursor-pointer active:ml-4 active:-mr-4 transition-all duration-300`}
                    />
                  </div>

                  <DropDown
                    options={detailReportOptions}
                    value={{
                      label: detailReport.name,
                      value: detailReport.name,
                    }}
                    DropDownPanel={styles.DropDownPanel}
                    text={styles.DropDownText}
                    onChange={handleSelectReport}
                    search={true}
                    barValue={"Detay Seçin"}
                  />
                  <div className=" relative">
                    <BsCalendarWeekFill
                      onClick={() => {
                        setCalendar(!calendar);
                      }}
                      className={`${styles.buttonIcon} text-fourth hover:text-slate-300 cursor-pointer`}
                    />
                    {calendar && (
                      <>
                        <div
                          onClick={() => {
                            setCalendar(!Calendar);
                          }}
                          className="fixed h-screen w-screen top-0 left-0 bg-transparent"
                        ></div>
                        <div className=" absolute top-14 bg-slate-400 rounded-md p-4 ">
                          <CalendarContainer>
                            <Calendar onChange={onChangeDate} value={date} />
                          </CalendarContainer>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleGetLogData}
                    className={`${styles.button}`}
                  >
                    <p className="">Getir</p>
                    <HiOutlineDocumentReport
                      className={`${styles.buttonIcon}`}
                    />
                  </button>
                </text>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
                <text className="flex items-center gap-2 self-center w-full mb-2">
                  <MdOutlineKeyboardArrowLeft
                    onClick={() => [setDir(false)]}
                    className={`${styles.buttonIcon} cursor-pointer active:-ml-4 active:mr-4 transition-all duration-300`}
                  />
                  <p className={`${styles.DesignFieldHeader}`}>İstatistik</p>
                  <MdOutlineKeyboardArrowRight
                    onClick={() => [setDir(true)]}
                    className={`${styles.buttonIcon} cursor-pointer active:ml-4 active:-mr-4 transition-all duration-300`}
                  />
                </text>
              </div>
              <div className="grid lg:grid-cols-2 gap-2 w-full h-[24rem] md:h-[32rem]">
                <div
                  className={`flex flex-col gap-4 bg-white rounded-md  shadow-md shadow-fourth py-4`}
                >
                  <p className=" flex items-center ml-12 font-SemiBold text-2xl text-gray-400">
                    <MdOutlineKeyboardArrowLeft
                      onClick={() => [setDetailDir(false)]}
                      className={`${styles.buttonIcon} cursor-pointer active:-ml-4 active:mr-4 transition-all duration-300`}
                    />
                    {detailDir ? "Arıza Bilgisi" : "Hata Bilgisi"}
                    <MdOutlineKeyboardArrowRight
                      onClick={() => [setDetailDir(true)]}
                      className={`${styles.buttonIcon} cursor-pointer active:ml-4 transition-all duration-300`}
                    />
                  </p>
                  {detailDir ? (
                    <div
                      className={`h-full w-full transition-all duration-200`}
                    >
                      {fault.length !== 0 ? (
                        <PieChartGraph data={fault} />
                      ) : (
                        <div
                          className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
                        >
                          Hata Kodu Henüz Yok !
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`h-full w-full transition-all duration-200`}
                    >
                      {error.length !== 0 ? (
                        <PieChartGraph data={error} />
                      ) : (
                        <div
                          className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
                        >
                          Hata Kodu Henüz Yok !
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`flex flex-col gap-4 bg-white rounded-md  shadow-md shadow-fourth py-4`}
                >
                  <p className=" ml-12 font-SemiBold text-2xl text-gray-400">
                    Tüketim Grafiği
                  </p>
                  <div className=" w-full h-full">
                    <Graph data={ProductData} bars={ProductBars} />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default DetailDevice;
