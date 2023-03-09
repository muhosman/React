import { useEffect, useState } from "react";

function DataSearchBar({ Data, handleSearch }) {
  const inputCss =
    "w-full h-11 input rounded-md shadow border-1 p-3 bg-slate-200 xl:text-XL md:text-BASE text-SM";
  const button =
    "xl:text-XL text-BASE items-center gap-2 text-white active:text-white hover:text-fourth flex bg-fourth rounded-md px-4 py-2 active:bg-fourth hover:bg-white border-2 border-fourth";

  const [input, setInput] = useState({
    mainFirmName: "",
    name: "",
    bayserNo: "",
    isActive: false,
  });
  const [clean, setClean] = useState(false);
  let filteredData = [];

  const cleanBar = () => {
    setClean(true);
    setInput({
      ...input,
      mainFirmName: "",
      name: "",
      bayserNo: "",
      isActive: false,
    });
  };

  useEffect(() => {
    if (clean === false) {
      if (
        (input.name === undefined || input.name === "") &&
        (input.bayserNo === undefined || input.bayserNo === "")
      ) {
        setClean(true);
        filteredData = Data;
      } else {
        filteredData = Data?.filter((Data) => {
          //return the item which contains the user input
          console.log(input);

          if (
            (input.name === undefined
              ? true
              : Data?.name.toLowerCase().includes(input.name.toLowerCase())) &&
            input.bayserNo === undefined
              ? true
              : Data?.bayserNo
                  .toLowerCase()
                  .includes(input.bayserNo.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (clean === false) {
        handleSearch(filteredData, true);
      }
    }
    if (clean === true) {
      handleSearch("", false);
    }
    setClean(false);
  }, [input]);

  return (
    <div className="flex gap-3 flex-col w-full text-xs xl:text-sm 2xl:text-base">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 items-center">
        <input
          className={`${inputCss}`}
          value={input.name}
          maxLength="40"
          placeholder="Firma İsmi"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, name: value });
          }}
        />
        <input
          className={`${inputCss}`}
          value={input.bayserNo}
          maxLength="40"
          placeholder="Bayser Numarası"
          onChange={(e) => {
            var value = e.target.value;
            setInput({ ...input, bayserNo: value });
          }}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button className={`${button}`} onClick={cleanBar}>
          Temizle
        </button>
      </div>
    </div>
  );
}

export default DataSearchBar;
