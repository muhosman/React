import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { useGetDeviceByIDQuery } from "../../../store";
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

  const [date, setDate] = useState(new Date());

  const [dir, setDir] = useState(false);
  const [detailDir, setDetailDir] = useState(false);
  const reportType = [
    { name: "Aylık Tüketim" },
    { name: "Haftalık Tüketim" },
    { name: "Günlük Tüketim" },
    { name: "Aylık Makine Hareketi" },
    { name: "Haftalık Makine Hareketi" },
    { name: "Günlük Makine Hareketi" },
  ];
  const [detailReport, setDetailReport] = useState("");
  const [calendar, setCalendar] = useState(false);

  const errorData = [
    {
      name: "Isıtıcı Hatası",
      value: 543,
      color: "#004080",
    },
    {
      name: "Karıştırıcı Arızası",
      value: 256,
      color: "#5F8D4E",
    },
    {
      name: "Su Seviyesi",
      value: 145,
      color: "#6d4a3a",
    },
    {
      name: "Karıştırıcı Arızası",
      value: 350,
      color: "#FFA500",
    },
  ];
  const faultData = [
    {
      name: "Isıtıcı Arızası",
      value: 645,
      color: "#004080",
    },
    {
      name: "Karıştırıcı Arızası",
      value: 365,
      color: "#5F8D4E",
    },
    {
      name: "Su Pompası Arızası",
      value: 876,
      color: "#6d4a3a",
    },
    {
      name: "Karıştırıcı Arızası",
      value: 2134,
      color: "#FFA500",
    },
  ];
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

  const ResultMainFirm = useGetDeviceByIDQuery({ id, token });
  const Data = ResultMainFirm?.data?.data?.device || [];
  const [input, setInput] = useState({
    name: "",
    ip: "",
    gsmNo: "",
    serialNo: "",
    imei: "",
    userPassword: "",
    adminPassword: "",
    note: "",
  });

  useEffect(() => {
    if (ResultMainFirm.status === "fulfilled") setInput({ ...Data });
  }, [ResultMainFirm]);

  const detailReportOptions = reportType?.map((item) => {
    return { label: item.name, value: item.name };
  });
  const handleSelectReport = (option) => {
    reportType?.map((item) => {
      if (option.value === item.name) {
        setDetailReport({
          ...input,
          name: item.name,
        });
      }
    });
  };

  const onChangeDate = (date) => {
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
  console.log(date);
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
          {dir ? (
            <>
              <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
                <text className="flex max-md:flex-col md:items-center gap-8 self-center w-full mb-2">
                  <div className=" flex items-center gap-2 self-center  mb-2">
                    <MdOutlineKeyboardArrowLeft
                      onClick={() => [setDir(false)]}
                      className={`${styles.buttonIcon} cursor-pointer active:-ml-4 active:mr-4 transition-all duration-300`}
                    />
                    <p className={`${styles.DesignFieldHeader}`}>
                      {input.name}
                    </p>
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
                  <button className={`${styles.button}`}>
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
                  <p className={`${styles.DesignFieldHeader}`}>{input.name}</p>
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
                      <PieChartGraph data={faultData} />
                    </div>
                  ) : (
                    <div
                      className={`h-full w-full transition-all duration-200`}
                    >
                      <PieChartGraph data={errorData} />
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
