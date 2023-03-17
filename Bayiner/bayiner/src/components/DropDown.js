import { useState, useEffect, useRef } from "react";
import { GoChevronDown } from "react-icons/go";
import Panel from "./Panel";

function Dropdown({
  options,
  value,
  onChange,
  search,
  barValue,
  text,
  DropDownPanel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef();
  const [inputFirm, setInputFirm] = useState("");

  useEffect(() => {
    const handler = (event) => {
      if (!divEl.current) {
        return;
      }

      if (!divEl.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handler, true);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setIsOpen(false);
    onChange(option);
  };
  const filteredData = options?.filter((el) => {
    //if no input the return the original
    if (inputFirm === "") {
      return el;
    }
    //return the item which contains the user input
    else {
      return el.label.toLowerCase().includes(inputFirm);
    }
  });
  const renderedOptions = filteredData?.map((option) => {
    return (
      <div
        className="hover:bg-sky-100 cursor-pointer p-1"
        onClick={() => handleOptionClick(option)}
        key={option.value}
      >
        {option.label}
      </div>
    );
  });

  return (
    <div ref={divEl} className={`relative flex w-full ${text}`}>
      <Panel
        className={`flex justify-between items-center cursor-pointer overflow-x-auto z-0 ${DropDownPanel}`}
        onClick={handleClick}
      >
        {value?.label || barValue}
        <GoChevronDown />
      </Panel>
      {isOpen && !search && (
        <Panel
          className={`absolute overflow-x-auto  ${isOpen ? "z-50" : "z-0"}`}
        >
          {renderedOptions}
        </Panel>
      )}
      {isOpen && search && (
        <div className="absolute rounded-md mt-2 w-full transition-all duration-200">
          <input
            className={`input p-3 w-full rounded-b-none rounded-md  border-2 border-b-gray-300  `}
            value={inputFirm}
            placeholder={barValue}
            onChange={(e) => {
              var lowerCase = e.target.value.toLowerCase();
              setInputFirm(lowerCase);
            }}
            onClick={() => setInputFirm("")}
          />
          <Panel
            className={`absolute h-36 rounded-t-none overflow-x-auto border-transparent mt-0 ${
              isOpen ? "z-50" : "z-0"
            }`}
          >
            {renderedOptions}
          </Panel>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
