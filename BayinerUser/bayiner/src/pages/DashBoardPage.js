import Example from "../components/Graph/DashboardBar";
import { useGetDashBoardDeviceQuery } from "../store/dashboardDeviceApi";
import useAuth from "../hooks/useAuth";
import { GiCoffeeCup } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import {
  MdConstruction,
  MdOutlineAttachMoney,
  MdOutlineCoffeeMaker,
} from "react-icons/md";
import { AiOutlineCoffee } from "react-icons/ai";
import styles from "../CustomStyles";
import { Component, useState } from "react";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import Cards from "../components/Cards/Cards";
import FolderList from "../components/List";
import CardWithFilterButtons from "../components/CardWithFilterButtons/CardWithFilterButtons";
import { useRef } from "react";
import ReactDOM from "react-dom/client";
import React from "react";
import testScroll from "../components/testScroll/testScroll";

// import required modules

function DashBoardPage() {
  function Number({ n }) {
    const { number } = useSpring({
      from: { number: 0 },
      number: n,
      delay: 200,
      config: { mass: 1, tension: 20, friction: 10 },
    });
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
  }

  const [activeConsumption, setActiveConsumption] = useState(0);

  const handleClickConsumption = (choice) => {
    setActiveConsumption(choice);
  };

  const exampleData = [
    {
      name: "Çay",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Türk Kahvesi",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Filtre Kahve",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Salep",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
  ];

  const subCompanyExamples = [
    {
      name: "subComp1",
      parent: "Company",
      consumption: [
        {
          name: "Çay",
          uv: 1200,
          pv: 4392,
          amt: 2450,
        },
        {
          name: "Türk Kahvesi",
          uv: 2342,
          pv: 1224,
          amt: 3422,
        },
        {
          name: "Filtre Kahve",
          uv: 3000,
          pv: 9800,
          amt: 2390,
        },
        {
          name: "Salep",
          uv: 4780,
          pv: 8908,
          amt: 1000,
        },
      ],
    },
    {
      name: "subCompany2",
      parent: "Company",
      consumption: [
        {
          name: "Çay",
          uv: 1600,
          pv: 4292,
          amt: 2600,
        },
        {
          name: "Türk Kahvesi",
          uv: 2982,
          pv: 1494,
          amt: 2222,
        },
        {
          name: "Filtre Kahve",
          uv: 3100,
          pv: 9200,
          amt: 2090,
        },
        {
          name: "Salep",
          uv: 1780,
          pv: 3908,
          amt: 7000,
        },
      ],
    },
    {
      name: "subCompany3",
      parent: "Company",
    },
    {
      name: "subCompany4",
      parent: "Company",
    },
    {
      name: "subCompany5",
      parent: "Company",
    },
    {
      name: "subCompany6",
      parent: "Company",
    },
    {
      name: "subCompany7",
      parent: "Company",
    },
    {
      name: "subCompany8",
      parent: "Company",
    },
    {
      name: "subCompany9",
      parent: "Company",
    },
  ];

  // const {
  //   data: dashboardDeviceData,
  //   isLoading: dashboardDeviceIsLoading,
  //   isFetching: dashboardDeviceIsFetching,
  //   error: dashboardDeviceError,
  //   refetch: dashboardDeviceRefetch,
  // } = useGetDashBoardDeviceQuery(token, {
  //   refetchOnMountOrArgChange: true,
  //   skip: false,
  // });

  // function monthName(ayNumarasi) {
  //   switch (ayNumarasi) {
  //     case "1":
  //       return "Ocak";
  //     case "2":
  //       return "Şubat";
  //     case "3":
  //       return "Mart";
  //     case "4":
  //       return "Nisan";
  //     case "5":
  //       return "Mayıs";
  //     case "6":
  //       return "Haziran";
  //     case "7":
  //       return "Temmuz";
  //     case "8":
  //       return "Ağustos";
  //     case "9":
  //       return "Eylül";
  //     case "10":
  //       return "Ekim";
  //     case "11":
  //       return "Kasım";
  //     case "12":
  //       return "Aralık";
  //     default:
  //       return "Geçersiz ay numarası";
  //   }
  // }

  // const ProductDataConsumptionFunction = () => {
  //   const ProductBars = [];
  //   const monthProduct = dashboardDeviceData?.data?.dashBoardDevices?.map(
  //     (dashBoardDevice) => {
  //       const Bar = {
  //         dataKey: dashBoardDevice.productName,
  //         fill:
  //           dashBoardDevice.productName === "Türk Kahvesi"
  //             ? "#6d4a3a"
  //             : dashBoardDevice.productName === "Filtre Kahve"
  //             ? "#00407d"
  //             : dashBoardDevice.productName === "Çay"
  //             ? "#5F8D4E"
  //             : dashBoardDevice.productName === "Salep"
  //             ? "#8D7B68"
  //             : "",
  //       };
  //       ProductBars.push(Bar);
  //       return dashBoardDevice.lastSixMonthConsumption?.map((month) => {
  //         return {
  //           month: monthName(month.monthName),
  //           [dashBoardDevice.productName]: month.consumption,
  //         };
  //       });
  //     }
  //   );

  //   const productsByMonth = {};

  //   monthProduct?.forEach((monthData) => {
  //     monthData?.forEach((productData) => {
  //       const { month, ...rest } = productData;

  //       if (productsByMonth[month]) {
  //         Object.assign(productsByMonth[month], rest);
  //       } else {
  //         productsByMonth[month] = rest;
  //       }
  //     });
  //   });

  //   const productsObj = {};
  //   ProductBars.forEach((bar) => {
  //     productsObj[bar.dataKey] = 0;
  //   });

  //   for (let i = 0; i < 6; i++) {
  //     const monthIndex = new Date().getMonth() + 1 - i;
  //     const month = monthIndex <= 0 ? 12 + monthIndex : monthIndex;
  //     const name = monthName(String(month));
  //     if (!productsByMonth[name]) {
  //       productsByMonth[name] = productsObj;
  //     }
  //   }

  //   const ProductData = Object.keys(productsByMonth)
  //     .map((month) => ({
  //       name: month,
  //       ...productsByMonth[month],
  //     }))
  //     .reverse();
  //   return [ProductData, ProductBars];
  // };

  // const [ProductData, ProductBars] = ProductDataConsumptionFunction();
  const graphCard = "flex flex-col items-center gap-4 bg-white rounded-md ";

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    // Replace this console.log with the action you want to happen when an item is clicked
    console.log(`Clicked on ${item.name}`);
    setSelectedItem(item);
  };

  function FilterButton({ button, handleClick, active }) {
    const activeStyle = "bg-white text-fourth border-fourth";
    const passiveStyle =
      "bg-fourth text-white border-white hover:bg-white hover:text-fourth ";
    return (
      <div className="flex justify-center gap-2 md:gap-6">
        <button
          onClick={() => {
            handleClick(0);
          }}
          className={`${button} ${styles.text} ${
            active === 0 ? activeStyle : passiveStyle
          }`}
        >
          Bugün
        </button>
        <button
          onClick={() => {
            handleClick(1);
          }}
          className={`${button} ${styles.text} ${
            active === 1 ? activeStyle : passiveStyle
          }`}
        >
          Dün
        </button>
        <button
          onClick={() => {
            handleClick(2);
          }}
          className={`${button} ${styles.text} ${
            active === 2 ? activeStyle : passiveStyle
          }`}
        >
          Haftalık
        </button>
        <button
          onClick={() => {
            handleClick(3);
          }}
          className={`${button} ${styles.text} ${
            active === 3 ? activeStyle : passiveStyle
          }`}
        >
          Aylık
        </button>
        <button
          onClick={() => {
            handleClick(4);
          }}
          className={`${button} ${styles.text} ${
            active === 4 ? activeStyle : passiveStyle
          }`}
        >
          Yıllık
        </button>
      </div>
    );
  }

  const buttonStyle = {
    border: "2px solid", // Add a border with 2px width
    padding: "0.5rem 1rem", // Add padding to the button
    borderRadius: "0.375rem", // Add rounded corners with 0.375rem radius
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", // Add a shadow
    backgroundColor: "white", // Set the background color
    color: "black", // Set the text color
    transition: "all 0.3s ease", // Add transition effect for hover animation
  };

  /* button={
    " p-2 border-2 hover:mx-4 hover:scale-110 rounded-md transition-all duration-300 shadow-xl"
  }*/

  const allCards = [
    <Cards type="coffee" />,
    <Cards type="coffee" />,
    <Cards type="coffee" />,
    <Cards type="coffee" />,
    <Cards type="coffee" />,
  ];
  const buttonNumber = 3;
  const [direction, setDirection] = useState(false);

  return (
    <div className="flex flex-col gap-12 w-full pr-10 mb-10  max-md:pl-10 bg-grey-500">
      <div className="flex flex-col gap-8 rounded-b-md bg-fourth ">
        <div className=" flex justify-center">
          <p className={`${styles.DesignFieldHeader} ml-12 pt-4 text-white`}>
            Machines
          </p>
        </div>

        <div
          className=" relative h-[12rem] w-full overflow-hidden
         grid md:grid-cols-3 grid-cols-2 p-4 rounded-b-md gap-6"
        >
          <div
            className={`${
              direction ? " -left-[300%]" : ""
            }  transition-all duration-300 absolute top-0 left-[2rem] grid grid-cols-3 gap-8`}
          >
            <div className=" w-full">
              <Cards type="coffee" />
            </div>
            <div className="w-full">
              <Cards type="tea" />
            </div>
            <div className="w-full">
              <Cards type="filter" />
            </div>
          </div>
          <div
            className={` ${
              direction ? "" : "left-[300%]"
            } transition-all duration-300 absolute top-0 -left-[37rem] translate-x-1/2 grid grid-cols-3 gap-6`}
          >
            <div className="w-full">
              <Cards type="salep" />
            </div>
            <div className="w-full">
              <Cards type="salep" />
            </div>
            <div className="w-full">
              <Cards type="salep" />
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-6 absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              className={` bg-white rounded-lg p-4 ${
                !direction ? " opacity-40 pointer-events-none" : ""
              }`}
              onClick={() => {
                setDirection(false);
              }}
            >
              Left
            </button>
            <button
              className={` ${
                direction
                  ? "bg-white rounded-lg p-4  opacity-40 pointer-events-none"
                  : "bg-white rounded-lg p-4  "
              }`}
              onClick={() => {
                setDirection(true);
              }}
            >
              right {"value of " + direction}
            </button>
          </div>
        </div>
        {/* THESE ARE THE BUTTONS WITHOUT THE CARD
        <div className="flex flex-col gap-3 p-4 bg-fourth">
        <FilterButton button={
                "p-2 border-2 hover:mx-4 hover:scale-110 rounded-md transition-all duration-300 shadow-xl"
              }
            />
        </div>*/}
      </div>
      <div className="grid md:grid-cols-2 grid-cols-2 p-2 rounded-b-md gap-6">
        <div className="bg-white flex flex-col gap-8 rounded-b-md">
          <div className=" flex justify-between">
            <p className={`${styles.DesignFieldHeader} ml-12 pt-4 text-fourth`}>
              Consumption Graph
            </p>
          </div>
          <div className={`${graphCard} w-full md:h-[24rem] h-[18rem]`}>
            {selectedItem ? (
              <Example data={selectedItem.consumption} />
            ) : (
              <Example data={exampleData} />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-10 rounded-b-md">
          <FolderList
            listOfCompanies={subCompanyExamples}
            onItemClick={handleItemClick}
          />
          <CardWithFilterButtons />
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
