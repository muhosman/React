import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
// Icon
import { useGetDeviceByIDQuery, useGetDeviceLogQuery } from "../../../store";
import styles from "../../../CustomStyles";
import PieChartGraph from "../../../components/Graph/PieChartGraph";
import styled from "styled-components";
import ChangableGraph from "../../../components/Graph/ChangableGraph";

import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

function DetailDevice() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();
  const day = new Date()?.getDate().toString().padStart(2, "0");
  const month = (new Date()?.getMonth() + 1).toString().padStart(2, "0");
  const year = new Date()?.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  const [active, setActive] = useState(0);

  const [input, setInput] = useState({
    id: id,
    token: token,
    data: "consument",
    createdInfo: formattedDate,
  });

  const [detailDir, setDetailDir] = useState(false);
  const responseDevice = useGetDeviceByIDQuery({ id: id, token: token });
  const Datas = responseDevice?.data?.data?.device || [];
  const response = useGetDeviceLogQuery(input);
  const sortedHourlyConsumption = response?.data?.data;

  function createProductDataAndBars(sortedHourlyConsumption) {
    if (!sortedHourlyConsumption) {
      return { productData: [], productBars: [] };
    }

    const ProductData = [];
    const ProductBars = new Set();

    // Rastgele renk oluşturmak için bir fonksiyon
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    for (const [hour, consumption] of Object.entries(sortedHourlyConsumption)) {
      const productDataItem = { name: hour };

      consumption.forEach((product) => {
        productDataItem[product.typeName] = product.quota;
        ProductBars.add(product.typeName);
      });

      ProductData.push(productDataItem);
    }

    const productBarsArray = Array.from(ProductBars).map((dataKey) => ({
      dataKey,
      fill: getRandomColor(),
    }));

    return { ProductData, ProductBars: productBarsArray };
  }

  // Kullanımı:
  const { ProductData, ProductBars } = createProductDataAndBars(
    sortedHourlyConsumption
  );

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
      color: generateColorByServiceCode(err.serviceCode),
    };
    findAndUpdate(error, errorItem);
  });

  Datas.faults?.forEach((flt) => {
    const faultItem = {
      name: flt.info,
      value: flt.amount,
      color: generateColorByServiceCode(flt.serviceCode),
    };
    findAndUpdate(fault, faultItem);
  });

  // Helper function to generate a color based on the serviceCode
  function generateColorByServiceCode(serviceCode) {
    // Convert the service code to a number between 0 and 1
    const ratio = (serviceCode % 360) / 360;

    // Generate an RGB color using the HSL color space
    const color = hslToRgb(ratio, 0.5, 0.5);

    // Convert the RGB color to a hex string
    return rgbToHex(color[0], color[1], color[2]);
  }

  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  function FilterButton({ button, active }) {
    const today = `${day}.${month}.${year}`;
    const week = `${day - 6}.${month}.${year}`;
    const thismonth = `${1}.${month}.${year}`;

    const activeStyle = "bg-white text-fourth border-fourth";
    const passiveStyle =
      "bg-fourth text-white border-white hover:bg-white hover:text-fourth ";
    return (
      <div className="flex justify-center gap-2 md:gap-6">
        <button
          onClick={() => {
            setInput({ ...input, createdInfo: today });
            setActive(0);
          }}
          className={`${button} ${styles.text} ${
            active === 0 ? activeStyle : passiveStyle
          }`}
        >
          Bugün
        </button>
        <button
          onClick={() => {
            setInput({ ...input, createdInfo: week });
            setActive(1);
          }}
          className={`${button} ${styles.text} ${
            active === 1 ? activeStyle : passiveStyle
          }`}
        >
          Haftalık
        </button>
        <button
          onClick={() => {
            setInput({ ...input, createdInfo: thismonth });
            setActive(2);
          }}
          className={`${button} ${styles.text} ${
            active === 2 ? activeStyle : passiveStyle
          }`}
        >
          Aylık
        </button>
      </div>
    );
  }

  return (
    <>
      {responseDevice.isFetching ||
      responseDevice.isLoading ||
      response.isFetching ||
      response.isLoading ? (
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
          <div className="grid gap-2 ">
            {detailDir ? (
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
                <div className=" grid grid-cols-2 h-[32rem] ">
                  <div
                    className={` w-full h-[24rem] md:h-[32rem] transition-all duration-200`}
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
                  <div className={`h-full w-full transition-all duration-200`}>
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
                </div>
              </div>
            ) : (
              <div
                className={`flex flex-col  gap-4 bg-white rounded-md  shadow-md shadow-fourth py-4`}
              >
                <div className=" flex justify-between">
                  <p className=" flex items-center ml-12 font-SemiBold text-2xl text-gray-400">
                    <MdOutlineKeyboardArrowLeft
                      onClick={() => [setDetailDir(false)]}
                      className={`${styles.buttonIcon} cursor-pointer active:-ml-4 active:mr-4 transition-all duration-300`}
                    />
                    Tüketim Grafiği
                    <MdOutlineKeyboardArrowRight
                      onClick={() => [setDetailDir(true)]}
                      className={`${styles.buttonIcon} cursor-pointer active:ml-4 transition-all duration-300`}
                    />
                  </p>
                  <div className="mr-12">
                    <FilterButton
                      button={
                        " p-2 bg-fourth border-2 border-fourth hover:bg-white hover:text-fourth rounded-md transition-all duration-300 shadow-xl hover:scale-110"
                      }
                      active={active}
                    />
                  </div>
                </div>

                <div className=" w-full h-[24rem] md:h-[32rem]">
                  {response?.data?.results !== 0 ? (
                    <ChangableGraph data={ProductData} bars={ProductBars} />
                  ) : (
                    <div
                      className={`${styles.DesignFieldHeader} flex items-center justify-center w-full h-full`}
                    >
                      Henüz bir tüketim yok!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default DetailDevice;
