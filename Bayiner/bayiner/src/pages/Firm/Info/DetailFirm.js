import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { useGetDeviceByIDQuery, useGetFirmByIDQuery } from "../../../store";
import styles from "../../../CustomStyles";
import Graph from "../../../components/Graph/DashboardBar";
import PieChartGraph from "../../../components/Graph/PieChartGraph";
import Calendar from "react-calendar";
import DropDown from "../../../components/DropDown";

import { BsCalendarWeekFill } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";

function DetailFirm() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();
  const [value, onChange] = useState(new Date());

  const [dir, setDir] = useState(false);
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

  const ResultMainFirm = useGetFirmByIDQuery({ id, token });
  const Data = ResultMainFirm?.data?.data?.firm || [];
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
                            setCalendar(!calendar);
                          }}
                          className="fixed h-screen w-screen top-0 left-0 bg-transparent"
                        ></div>
                        <Calendar
                          className={` top-12 absolute p-4 w-fit h-fit bg-white rounded-md tracking-widest ${styles.text}`}
                          onChange={onChange}
                          value={value}
                        />
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

              <div>
                <p className=" flex items-center ml-12 font-SemiBold text-2xl text-gray-400">
                  Firma Tüketimi
                </p>
                <div className="flex gap-2 w-full h-[24rem] md:h-[32rem]">
                  <Graph data={ProductData} bars={ProductBars} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default DetailFirm;
