import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
// Icon
import { useGetDeviceLogReportQuery } from "../../../store";
import styles from "../../../CustomStyles";
import Calendar from "react-calendar";
import DropDown from "../../../components/DropDown";
import styled from "styled-components";
import SortableTable from "../../../components/SortableTable";
import PaginationBar from "../../../components/PaginationBar";

import { BsCalendarWeekFill, BsFileEarmarkBarGraph } from "react-icons/bs";

import { HiOutlineDocumentReport } from "react-icons/hi";

function ReportDevice() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();
  const [skipRequest, setSkipRequest] = useState(true);
  const [choiceDate, setChoiceDate] = useState("");
  const [info, setInfo] = useState(false);
  const [input, setInput] = useState({
    id: id,
    token: token,
    data: "",
    createdInfo: "",
    createdInfoSecond: "",
  });

  const [date, setDate] = useState(new Date());
  const [dateSecond, setDateSecond] = useState(new Date());
  const [calendar, setCalendar] = useState(false);
  const [calendarSeconda, setCalendarSecond] = useState(false);

  const [paginationNumber, setPaginationNumber] = useState(1);

  const [detailReport, setDetailReport] = useState("");
  const { data, refetch, isFetching, isLoading, isError } =
    useGetDeviceLogReportQuery(input, {
      skip: skipRequest,
    });
  const Datas = data?.data || [];

  const config = [
    {
      label: "İncele",
      render: (data) => (
        <div className=" flex items-center justify-center">
          <buton
            onClick={() => {
              setChoiceDate(data.date);
              setInfo(true);
            }}
            className={`${styles.button}  w-fit`}
          >
            <BsFileEarmarkBarGraph className={`${styles.buttonIcon}`} />
          </buton>
        </div>
      ),
    },
    {
      label: "Rapor Tarihi",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Rapor Tarihi:</div>
          {data.date}
        </>
      ),
    },
  ];

  const ReportReturn = (item, date) => {
    const filteredItems = item.filter((entry) => entry.date === date);

    if (input.data === "consument") {
      return (
        <table className=" ">
          <thead>
            <tr>
              <th className=" px-4 py-2">Ürün</th>
              <th className=" px-4 py-2">Tüketim</th>
              <th className=" px-4 py-2">Firma İsmi</th>
              <th className=" px-4 py-2">Tarih</th>
              <th className=" px-4 py-2">Saat</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry, index) =>
              entry.logs.map((log, logIndex) =>
                log.productInfo.map((product, productIndex) => (
                  <tr
                    className=" odd:bg-input"
                    key={`${index}-${logIndex}-${productIndex}`}
                  >
                    <td className=" p-2 text-center">{product.typeName}</td>
                    <td className=" p-2 text-center">{product.quota}</td>
                    <td className=" p-2 text-center">{log.firmName}</td>
                    <td className=" p-2 text-center">{log.createdInfo.time}</td>
                    <td className=" p-2 text-center">{entry.date}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      );
    }
    if (input.data === "updateInfo") {
      return (
        <table className=" ">
          <thead>
            <tr>
              <th className=" px-4 py-2">İsim</th>
              <th className=" px-4 py-2">Soyisim</th>
              <th className=" px-4 py-2">Bilgi</th>
              <th className=" px-4 py-2">Önceki Değer</th>
              <th className=" px-4 py-2">Sonraki Değer</th>
              <th className=" px-4 py-2">Tarih</th>
              <th className=" px-4 py-2">Saat</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry, index) =>
              entry.logs.map((log, logIndex) =>
                log.info.map((info, infoIndex) => (
                  <tr className=" odd:bg-input" key={`${index}-${infoIndex}`}>
                    <td className=" p-2 text-center">{log.name}</td>
                    <td className=" p-2 text-center">{log.lastName}</td>
                    <td className=" p-2 text-center">{info.infoName}</td>
                    <td className=" p-2 text-center">{info.valueFrom}</td>
                    <td className=" p-2 text-center">{info.valueTo}</td>
                    <td className=" p-2 text-center">{log.createdInfo.date}</td>
                    <td className=" p-2 text-center">{log.createdInfo.time}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      );
    }
    if (input.data === "updateSetting") {
      return (
        <table className=" ">
          <thead>
            <tr>
              <th className=" px-4 py-2">İsim</th>
              <th className=" px-4 py-2">Soyisim</th>
              <th className=" px-4 py-2">Bilgi</th>
              <th className=" px-4 py-2">Önceki Değer</th>
              <th className=" px-4 py-2">Sonraki Değer</th>
              <th className=" px-4 py-2">Tarih</th>
              <th className=" px-4 py-2">Saat</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry, index) =>
              entry.logs.map((log, logIndex) =>
                log.setting.map((info, infoIndex) => (
                  <tr className=" odd:bg-input" key={`${index}-${infoIndex}`}>
                    <td className=" p-2 text-center">{log.name}</td>
                    <td className=" p-2 text-center">{log.lastName}</td>
                    <td className=" p-2 text-center">{info.infoName}</td>
                    <td className=" p-2 text-center">{info.valueFrom}</td>
                    <td className=" p-2 text-center">{info.valueTo}</td>
                    <td className=" p-2 text-center">{log.createdInfo.date}</td>
                    <td className=" p-2 text-center">{log.createdInfo.time}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      );
    }
    if (input.data === "fault") {
      return (
        <table>
          <thead>
            <tr>
              <th className=" px-4 py-2">İsim</th>
              <th className=" px-4 py-2">Soyisim</th>
              <th className=" px-4 py-2">Hata İsmi</th>
              <th className=" px-4 py-2">Hata Kodu</th>
              <th className=" px-4 py-2">Firma İsmi</th>
              <th className=" px-4 py-2">Tarih</th>
              <th className=" px-4 py-2">Saat</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry, index) =>
              entry.logs.map((faultItem, faultIndex) => (
                <tr className="odd:bg-input" key={`${index}-${faultIndex}`}>
                  <td className=" p-2 text-center">{faultItem.name}</td>
                  <td className=" p-2 text-center">{faultItem.lastName}</td>
                  <td className=" p-2 text-center">{faultItem.faultName}</td>
                  <td className=" p-2 text-center">{faultItem.faultCode}</td>
                  <td className=" p-2 text-center">{faultItem.firmName}</td>
                  <td className=" p-2 text-center">
                    {faultItem.createdInfo.date}
                  </td>
                  <td className=" p-2 text-center">
                    {faultItem.createdInfo.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      );
    }

    if (input.data === "error") {
      return (
        <table>
          <thead>
            <tr>
              <th className=" px-4 py-2">İsim</th>
              <th className=" px-4 py-2">Soyisim</th>
              <th className=" px-4 py-2">Arıza İsmi</th>
              <th className=" px-4 py-2">Arıza Kodu</th>
              <th className=" px-4 py-2">Firma İsmi</th>
              <th className=" px-4 py-2">Tarih</th>
              <th className=" px-4 py-2">Saat</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry, index) =>
              entry.logs.map((errorItem, errorIndex) => (
                <tr className="odd:bg-input" key={`${index}-${errorIndex}`}>
                  <td className=" p-2 text-center">{errorItem.name}</td>
                  <td className=" p-2 text-center">{errorItem.lastName}</td>
                  <td className=" p-2 text-center">{errorItem.errorName}</td>
                  <td className=" p-2 text-center">{errorItem.errorCode}</td>
                  <td className=" p-2 text-center">{errorItem.firmName}</td>
                  <td className=" p-2 text-center">
                    {errorItem.createdInfo.date}
                  </td>
                  <td className=" p-2 text-center">
                    {errorItem.createdInfo.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      );
    }
  };
  const keyFn = (data) => {
    return data._id;
  };

  const reportType = [
    { name: "Tüketim" },
    { name: "Ayar Değişikliği" },
    { name: "Bilgi Değişikliği" },
    { name: "Hata" },
    { name: "Arıza" },
    { name: "Manuel Yükleme" },
  ];

  const handleGetLogData = () => {
    if (input.createdInfo && detailReport.name) {
      setSkipRequest(false);
      refetch();
    }
  };

  const detailReportOptions = reportType?.map((item) => {
    return { label: item.name, value: item.name };
  });
  const handleSelectReport = (option) => {
    const data =
      "Tüketim" === option.value
        ? "consument"
        : "Ayar Değişikliği" === option.value
        ? "updateSetting"
        : "Bilgi Değişikliği" === option.value
        ? "updateInfo"
        : "Hata" === option.value
        ? "error"
        : "Arıza" === option.value
        ? "fault"
        : "Manuel Yükleme" === option.value
        ? "manuelQuotaUpdate"
        : "";

    reportType?.map((item) => {
      if (option.value === item.name) {
        setDetailReport({
          name: item.name,
        });
        setInput({ ...input, data: data });
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

  const onChangeDateSecond = (dateSecond) => {
    // tarih değerlerini ayrıştırın
    const day = dateSecond?.getDate().toString().padStart(2, "0");
    const month = (dateSecond?.getMonth() + 1).toString().padStart(2, "0");
    const year = dateSecond?.getFullYear();

    // "gg.aa.yyyy" formatında bir tarih dizesi oluşturun
    const formattedDate = `${day}.${month}.${year}`;
    setInput({ ...input, createdInfoSecond: formattedDate });
    setDateSecond(dateSecond);
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
      {info && (
        <div>
          <div
            onClick={() => {
              setInfo(false);
            }}
            className="fixed inset-0 z-40 bg-gray-300 opacity-80 "
          ></div>
          <div
            className={`fixed z-50 top-1/2 left-1/2 -translate-y-1/2 overflow-y-scroll no-scrollbar rounded-xl -translate-x-1/2  w-fit max-h-[41rem]`}
          >
            <div
              className=" border-4 border-fourth p-4 bg-white flex flex-col justify-center rounded-xl
          items-center w-fit h-fit"
            >
              {ReportReturn(Datas, choiceDate)}
            </div>
          </div>
        </div>
      )}
      <div className="flex z-30 flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
        <text className="flex max-md:flex-col md:items-center gap-8 self-center w-fit mb-2">
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
          <div className=" relative flex gap-4 items-center">
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
            {input.createdInfo && (
              <p className={`${styles.inputTag} w-fit`}>{input.createdInfo}</p>
            )}
          </div>

          <div className=" relative flex gap-4 items-center">
            <BsCalendarWeekFill
              onClick={() => {
                setCalendarSecond(!calendarSeconda);
              }}
              className={`${styles.buttonIcon} text-fourth hover:text-slate-300 cursor-pointer`}
            />
            {calendarSeconda && (
              <>
                <div
                  onClick={() => {
                    setCalendarSecond(!calendarSeconda);
                  }}
                  className="fixed h-screen w-screen top-0 left-0 bg-transparent"
                ></div>
                <div className=" absolute top-14 bg-slate-400 rounded-md p-4 ">
                  <CalendarContainer>
                    <Calendar
                      onChange={onChangeDateSecond}
                      value={dateSecond}
                    />
                  </CalendarContainer>
                </div>
              </>
            )}
            {input.createdInfoSecond && (
              <p className={`${styles.inputTag} w-fit`}>
                {input.createdInfoSecond}
              </p>
            )}
          </div>

          <button
            onClick={handleGetLogData}
            className={`${styles.button} w-fit`}
          >
            <p className="">Getir</p>
            <HiOutlineDocumentReport className={`${styles.buttonIcon}`} />
          </button>
        </text>
      </div>
      {isFetching ? (
        <div className=" flex w-full h-full justify-center items-center">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{}}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#c0efff"
            color="#004080"
          />
        </div>
      ) : isError || Datas?.length === 0 ? (
        <div
          className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
        >
          Rapor Bulunamadı !
        </div>
      ) : (
        <div className=" z-20">
          <div className="flex flex-col items-center">
            <PaginationBar
              elements={Datas}
              info="Bu bilgilerde bir cihaz bulunamadı."
              paginationNumber={paginationNumber}
              setPaginationNumber={setPaginationNumber}
            />
          </div>
          <SortableTable
            data={Datas}
            config={config}
            keyFn={keyFn}
            paginationNumber={paginationNumber}
          />
        </div>
      )}
    </>
  );
}

export default ReportDevice;
