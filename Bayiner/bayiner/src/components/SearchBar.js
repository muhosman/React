import { useEffect, useState, useRef } from "react";

function DataSearchBar({ Data, HandleSearch, configInput, searchIndex }) {
  const [input, setInput] = useState([]);
  const [flag, setFlag] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevCountRef = useRef();
  const searchResults = [];
  const newInput = [];

  useEffect(() => {
    prevCountRef.current = activeIndex;
  });

  useEffect(() => {}, [flag]);
  const cleanBar = () => {
    HandleSearch("");
    setInput([]);
  };

  const filteredData = (index) => {
    const Filtered = Data?.filter((Data, i) => {
      //return the item which contains the user input
      if (!Data[index]?.toLowerCase().includes(input[index])) {
        searchResults[i] = false;
      } else {
        searchResults[i] = true;
      }

      return searchResults;
    });

    return Filtered;
  };
  const handleClickSearch = (index) => {
    filteredData(index);
    HandleSearch(searchResults);
  };

  return (
    <div className="flex gap-3 flex-col w-full text-xs xl:text-sm 2xl:text-base ">
      <div className="grid xl:grid-cols-4 grid-cols-2 gap-3 mb-6 ">
        {configInput.map((conf, index) => {
          return (
            <input
              className="w-full h-12 input rounded-full shadow border-1 p-3"
              value={input[index]}
              placeholder={conf}
              onInput={(e) => {
                var searchingElement = e.target.value.toLowerCase();
                const New = [...input];
                New[index] = searchingElement;
                setInput(New);
                handleClickSearch(index);
              }}
              onClick={() => {
                setActiveIndex(index);
                newInput[index] = [...input];
                newInput[index] = [];
                setInput(newInput);
              }}
            />
          );
        })}
      </div>

      <div className="overflow-x-auto flex justify-end gap-4">
        <button
          className="p-4 bg-third text-fourth hover:bg-secondary active:bg-third rounded-xl"
          onClick={cleanBar}
        >
          Temizle
        </button>
      </div>
    </div>
  );
}

export default DataSearchBar;
