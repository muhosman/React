import Graph from "../components/Graph/DashboardBar";
import LineChartGraph from "../components/Graph/LineChartGraph";
import PieChartGraph from "../components/Graph/PieChartGraph";
import { useState } from "react";
import { BsPersonCheck } from "react-icons/bs";
import { GiTireIronCross } from "react-icons/gi";
import {
  MdConstruction,
  MdOutlineAttachMoney,
  MdOutlineCoffeeMaker,
} from "react-icons/md";
import { useSpring, animated } from "react-spring";
import { GiCoffeeCup } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import styles from "../CustomStyles";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
}

function DashBoardPage() {
  const [direction, setDirection] = useState(0);
  const [directionTiny, setDirectionTiny] = useState(0);

  const graphCard = "flex flex-col items-center gap-4 bg-white rounded-md ";
  const ProfileData = [
    {
      "Bayser No": 232,
      "Firma İsmi": "LCW",
      Satış: 23456,
    },
    {
      "Bayser No": 214,
      "Firma İsmi": "TURKCELL",
      Satış: 20456,
    },
    {
      "Bayser No": 2322,
      "Firma İsmi": "Petrol Ofisi",
      Satış: 18245,
    },
    {
      "Bayser No": 3245,
      "Firma İsmi": "MADO",
      Satış: 14267,
    },
    {
      "Bayser No": 2325,
      "Firma İsmi": "COCKSHOP",
      Satış: 11577,
    },
  ];
  const FaultData = [
    {
      "Seri Numarası": "121.32.46.234",
      "Cihaz İsmi": "Türk Kahvesi - 4",
    },
    {
      "Seri Numarası": 214,
      "Cihaz İsmi": "Filtre Kahve - 2",
    },
    {
      "Seri Numarası": 2322,
      "Cihaz İsmi": "Türk Kahvesi - 2 Çay - 2",
    },
    {
      "Seri Numarası": 3245,
      "Cihaz İsmi": "Türk Kahvesi - 2",
    },
    {
      "Seri Numarası": 2325,
      "Cihaz İsmi": "Çay - 4",
    },
  ];
  const ErrorData = [
    {
      "Seri Numarası": 232,
      "Firma İsmi": "LCW",
      Satış: 23456,
    },
    {
      "Seri Numarası": 214,
      "Firma İsmi": "TURKCELL",
      Satış: 20456,
    },
    {
      "Seri Numarası": 2322,
      "Firma İsmi": "Petrol Ofisi",
      Satış: 18245,
    },
    {
      "Seri Numarası": 3245,
      "Firma İsmi": "MADO",
      Satış: 14267,
    },
    {
      "Seri Numarası": 2325,
      "Firma İsmi": "COCKSHOP",
      Satış: 11577,
    },
  ];
  const ConsumptionBottomData = [
    {
      name: "Müşteride Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Servisde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Depoda Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Plasiyerde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Kritik Seviyedeki Cihazlar",
      amount: 0,
    },

    {
      name: "Kritik Seviyedeki Firmalar",
      amount: 0,
    },
    {
      name: "Kotası Biten Cihazlar",
      amount: 0,
    },
    {
      name: "Son 3 Gündür Bağlanmayanlar",
      amount: 0,
    },
  ];
  const ErrorBottomData = [
    {
      name: "Müşteride Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Servisde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Depoda Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Plasiyerde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Kritik Seviyedeki Cihazlar",
      amount: 0,
    },

    {
      name: "Kritik Seviyedeki Firmalar",
      amount: 0,
    },
    {
      name: "Kotası Biten Cihazlar",
      amount: 0,
    },
    {
      name: "Son 3 Gündür Bağlanmayanlar",
      amount: 0,
    },
  ];
  const FaultBottomData = [
    {
      name: "Müşteride Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Servisde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Depoda Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Plasiyerde Bulunan Cihazlar",
      amount: 0,
    },
    {
      name: "Kritik Seviyedeki Cihazlar",
      amount: 0,
    },

    {
      name: "Kritik Seviyedeki Firmalar",
      amount: 0,
    },
    {
      name: "Kotası Biten Cihazlar",
      amount: 0,
    },
    {
      name: "Son 3 Gündür Bağlanmayanlar",
      amount: 0,
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

  function FilterButton({ button }) {
    return (
      <div className="flex justify-center gap-2 md:gap-6">
        <button className={`${button} ${styles.text}`}>Dün</button>
        <button className={`${button} ${styles.text}`}>Bugün</button>
        <button className={`${button} ${styles.text}`}>Haftalık</button>
        <button className={`${button} ${styles.text}`}>Aylık</button>
        <button className={`${button} ${styles.text}`}>Yıllık</button>
      </div>
    );
  }
  function ProfileTag({ data, header }) {
    const tableTD = "text-center mt-2 xl:p-4 lg:p-4 md:p-3 p-2";
    const tableTH = "text-center xl:p-6 lg:p-4 md:p-3 p-2";
    const keys = Object.keys(data[0]); // obje özelliklerinin listesi

    return (
      <div className="flex flex-col bg-white w-full h-full rounded-lg shadow-xl">
        <div className="flex flex-col gap-4 p-4">
          <p className={`${styles.DesignFieldHeader} text-fourth text-center `}>
            {header}
          </p>
          <FilterButton
            button={
              " p-2 bg-fourth text-white border-2 border-fourth hover:bg-white hover:text-fourth rounded-md transition-all duration-300 shadow-xl hover:scale-110"
            }
          />
        </div>
        <div className=" flex items-center justify-center  h-full shadow-lg  rounded-md p-2">
          <table className=" w-full ">
            <thead className="  ">
              <tr className=" ">
                <th className={`${tableTH} ${styles.text}`}>Sıralama </th>
                {keys.map((key) => (
                  <th className={`${tableTH} ${styles.text}`}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr className="border-collapse rounded-md odd:bg-slate-200   hover:scale-105 transition-all duration-300 cursor-pointer">
                    <td className={`${tableTD} ${styles.text} rounded-l-md`}>
                      {index + 1}
                    </td>
                    {keys.map((key) => (
                      <td className={`${tableTD} ${styles.text}`}>
                        {item[key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function DashTag(props) {
    const data = [
      {
        title: "Aramıza Katılan Firmalar",
        value: 1264,
        color: "bg-green-300",
        icon: <BsPersonCheck className={`${styles.buttonIcon}`} />,
      },
      {
        title: "Aramızdan Ayrılan Firmalar",
        value: 364,
        color: "bg-red-300",
        icon: <GiTireIronCross className={`${styles.buttonIcon}`} />,
      },
      {
        title: "Üretilen Cihazlar",
        value: 64,
        color: "bg-green-300",
        icon: <MdConstruction className={`${styles.buttonIcon}`} />,
      },
      {
        title: "Kazanç",
        value: 1234576,
        color: "bg-purple-300",
        icon: <MdOutlineAttachMoney className={`${styles.buttonIcon}`} />,
      },
    ];

    return (
      <div className="grid lg:grid-cols-4 grid-cols-2 w-full gap-8">
        {data.map((item) => (
          <div
            key={item.title}
            className="flex max-md:flex-col bg-white gap-3 items-center md:justify-between shadow-xl hover:scale-110 cursor-pointer rounded-md p-6 hover:shadow-2xl transition-all duration-200"
          >
            <div
              className={`${item.color}  p-4 w-fit rounded-md flex items-center justify-center`}
            >
              {item.icon}
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <p className={`${styles.text} text-center`}>{item.title}</p>
              <p className={`${styles.textTitle}`}>
                <Number n={item.value} />
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function DashTag1(props) {
    const Data = [
      {
        icon: <FaCoffee className={`${styles.buttonIcon}`} />,
        name: "Çay",
        amount: 32235,
        color: "bg-[#5F8D4E]",
      },
      {
        icon: <GiCoffeeCup className={`${styles.buttonIcon}`} />,
        name: "Türk Kahvesi",
        amount: 23532,
        color: "bg-[#6d4a3a]",
      },
      {
        icon: <MdOutlineCoffeeMaker className={`${styles.buttonIcon}`} />,
        name: "Fitre Kahve",
        amount: 12534,
        color: "bg-[#322110]",
      },
    ];
    return (
      <>
        {Data?.map((item) => {
          return (
            <div className={`h-fit ${item.color} text-white rounded-md py-4`}>
              <div className="flex flex-col items-center justify-center gap-2 ">
                <div className=" flex gap-4  items-center border-b-4 border-white w-full justify-center pb-2">
                  {item.icon}
                  <p className={`${styles.Bigtext}`}>{item.name}</p>
                </div>

                <p className={`${styles.BigtextTitle}`}>
                  <Number n={item.amount} />
                </p>
              </div>
            </div>
          );
        })}
      </>
    );
  }
  function DashTag2(props) {
    return (
      <div className="flex flex-col items-center">
        <p className="  font-extrabold">{props.amount}</p>
        <p className="text-center text-sm">{props.name}</p>
      </div>
    );
  }

  function DashTag3({ data }) {
    return (
      <>
        {data.map((item) => {
          return (
            <div className="flex flex-col bg-white gap-3 items-center justify-between shadow-xl hover:scale-110 cursor-pointer rounded-md p-6 hover:shadow-2xl transition-all duration-200">
              <p className={`${styles.textTitle}`}>{item.amount}</p>
              <p className={`${styles.text} text-center`}>{item.name}</p>
            </div>
          );
        })}
      </>
    );
  }

  const handleMenu = (dir) => {
    if (dir === "left") {
      if (direction - 1 >= 0) {
        setDirection(direction - 1);
      }
    } else if (dir === "right") {
      if (direction + 1 <= 2) {
        setDirection(direction + 1);
      }
    }
  };
  const handleError = (dir) => {
    if (dir === "left") {
      if (directionTiny - 1 >= 0) {
        setDirectionTiny(directionTiny - 1);
      }
    } else if (dir === "right") {
      if (directionTiny + 1 <= 1) {
        setDirectionTiny(directionTiny + 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full pr-10 mb-10  max-md:pl-10 bg-fourt">
      <p
        className={`${styles.DesignFieldHeader} border-b-4 border-fourth text-fourth flex gap-4 items-center pb-2`}
      >
        <FaChevronLeft
          onClick={() => {
            handleMenu("left");
          }}
          className={`${styles.buttonIcon} cursor-pointer active:-ml-2 active:mr-2 transition-all duration-100`}
        />
        YÖNETİM DASHBOARD
        <FaChevronRight
          onClick={() => {
            handleMenu("right");
          }}
          className={`${styles.buttonIcon} cursor-pointer active:ml-2 transition-all duration-100`}
        />
      </p>
      {direction === 1 && (
        <div className=" flex flex-col gap-4">
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-8 h-[32rem]">
            <div
              className={`flex flex-col gap-4 bg-white rounded-md shadow-xl py-4 `}
            >
              <div className=" flex justify-between">
                <p className={`${styles.DesignFieldHeader} ml-6 text-fourth`}>
                  Yıllık Mali Hareket
                </p>
                <div className=" grid gap-2 justify-end mr-8 opacity-80">
                  <div className=" flex gap-3 items-center">
                    <span className=" bg-[#004080] w-4 h-4 rounded-md"></span>
                    <p className={`${styles.DesignFieldHeader}  text-fourth`}>
                      Kazanç (₺)
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${graphCard} w-full md:h-full h-[24rem] `}>
                <LineChartGraph />
              </div>
            </div>
            <ProfileTag header={"Firma Satışları"} data={ProfileData} />
          </div>
          <div className=" flex-col bg-fourth flex items-center justify-between shadow-lg rounded-md py-4 px-6 gap-4 w-full">
            <p className={`${styles.DesignFieldHeader} text-white`}>
              Genel Bakış
            </p>
            <FilterButton
              button={
                " p-2 bg-white text-fourth border-2 border-white hover:bg-fourth hover:text-white rounded-md transition-all duration-300 shadow-xl"
              }
            />
            <DashTag />
          </div>
        </div>
      )}
      {direction === 0 && (
        <div className={`flex flex-col gap-4 `}>
          <div className=" grid lg:grid-cols-2 grid-cols-1 gap-8 h-[32rem]">
            <div
              className={`flex flex-col gap-4 bg-white rounded-md shadow-xl py-4 `}
            >
              <div className=" flex justify-between">
                <p className={`${styles.DesignFieldHeader} ml-12 text-fourth`}>
                  Yıllık Tüketim Hareketi
                </p>
              </div>
              <div className={`${graphCard}  w-full md:h-full h-[24rem] `}>
                <Graph data={ProductData} bars={ProductBars} />
              </div>
            </div>
            <div className="flex flex-col bg-white w-full rounded-lg shadow-xl">
              <div className="flex flex-col bg-fourth rounded-t-md gap-4 p-4">
                <p
                  className={`${styles.DesignFieldHeader} text-center text-white`}
                >
                  Ürün Tüketimleri
                </p>
                <FilterButton
                  button={
                    " p-2 bg-white text-fourth border-2 border-white hover:bg-fourth hover:text-white rounded-md transition-all duration-300 shadow-xl"
                  }
                />
              </div>
              <div className="grid md:grid-cols-3 grid-cols-2 p-4  rounded-b-md gap-6 bg-white ">
                <DashTag1 />
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-fourth p-4 gap-4 rounded-md">
            <p
              className={`${styles.DesignFieldHeader} ml-6 text-white text-center`}
            >
              Kritik Bilgiler
            </p>
            <div className="grid 2xl:grid-cols-8 xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2  ">
              <DashTag3 data={ConsumptionBottomData} />
            </div>
          </div>
        </div>
      )}
      {direction === 2 && (
        <>
          {directionTiny === 0 && (
            <div className={`flex flex-col gap-4 `}>
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-8 h-[32rem]">
                <div
                  className={`flex flex-col gap-4 bg-white rounded-md shadow-lg shadow-fourth py-4`}
                >
                  <p
                    className={`${styles.DesignFieldHeader} ml-6 flex gap-4 items-center pb-2 opacity-50`}
                  >
                    <FaChevronLeft
                      onClick={() => {
                        handleError("left");
                      }}
                      className={`${styles.tinyButtonIcon} cursor-pointer active:-ml-2 active:mr-2 transition-all duration-100`}
                    />
                    Arıza Bilgisi
                    <FaChevronRight
                      onClick={() => {
                        handleError("right");
                      }}
                      className={`${styles.tinyButtonIcon} cursor-pointer active:ml-2 transition-all duration-100`}
                    />
                  </p>
                  <div className={`h-[18rem] md:h-[24rem] w-full`}>
                    <PieChartGraph
                      data={[
                        {
                          name: "Isıtıcı Arızası",
                          value: 400,
                          color: "#004080",
                        },
                        {
                          name: "Karıştırıcı Arızası",
                          value: 300,
                          color: "#5F8D4E",
                        },
                        {
                          name: "Su Seviyesi",
                          value: 300,
                          color: "#6d4a3a",
                        },
                        {
                          name: "Karıştırıcı Arızası",
                          value: 200,
                          color: "#FFA500",
                        },
                      ]}
                    />
                  </div>
                </div>
                <ProfileTag header={"Arıza Tablosu"} data={FaultData} />
              </div>
              <div className="flex flex-col bg-fourth p-4 gap-4 rounded-md">
                <p
                  className={`${styles.DesignFieldHeader} ml-6 text-white text-center`}
                >
                  Kritik Bilgiler
                </p>
                <div className="grid 2xl:grid-cols-8 xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2  ">
                  <DashTag3 data={ConsumptionBottomData} />
                </div>
              </div>
            </div>
          )}
          {directionTiny === 1 && (
            <div className={`flex flex-col gap-4 `}>
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-8 h-[32rem]">
                <div
                  className={`flex flex-col gap-4 bg-white rounded-md shadow-lg shadow-fourth py-4`}
                >
                  <p
                    className={`${styles.DesignFieldHeader} ml-6 flex gap-4 items-center pb-2 opacity-50`}
                  >
                    <FaChevronLeft
                      onClick={() => {
                        handleError("left");
                      }}
                      className={`${styles.tinyButtonIcon} cursor-pointer active:-ml-2 active:mr-2 transition-all duration-100`}
                    />
                    Hata Bilgisi
                    <FaChevronRight
                      onClick={() => {
                        handleError("right");
                      }}
                      className={`${styles.tinyButtonIcon} cursor-pointer active:ml-2 transition-all duration-100`}
                    />
                  </p>
                  <div className={`h-[18rem] md:h-[24rem] w-full`}>
                    <PieChartGraph
                      data={[
                        {
                          name: "Isıtıcı Arızası",
                          value: 400,
                          color: "#004080",
                        },
                        {
                          name: "Karıştırıcı Arızası",
                          value: 300,
                          color: "#5F8D4E",
                        },
                        {
                          name: "Su Seviyesi",
                          value: 300,
                          color: "#6d4a3a",
                        },
                        {
                          name: "Karıştırıcı Arızası",
                          value: 200,
                          color: "#FFA500",
                        },
                      ]}
                    />
                  </div>
                </div>
                <ProfileTag header={"Hata Tablosu"} data={FaultData} />
              </div>
              <div className="flex flex-col bg-fourth p-4 gap-4 rounded-md">
                <p
                  className={`${styles.DesignFieldHeader} ml-6 text-white text-center`}
                >
                  Kritik Bilgiler
                </p>
                <div className="grid 2xl:grid-cols-8 xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2  ">
                  <DashTag3 data={ConsumptionBottomData} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashBoardPage;
