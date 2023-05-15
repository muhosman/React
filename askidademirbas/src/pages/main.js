import { useState, useRef, useEffect } from "react";
import DataSearchBar from "../components/dataSearchBar";
import PaginationBar from "../components/paginationBar";
import SortableTable from "../components/sortableTable";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Checkbox from "@mui/material/Checkbox";
import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { FaSearch } from "react-icons/fa";
import InputAdornment from "@mui/material/InputAdornment";
import imager from "../assets/sandalye.jpg";
export default function Main() {
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [searchBar, setSearchBar] = useState(true);
  const [filteredData, setFilteredData] = useState("");
  const [isSearch, setIsSearch] = useState();
  const [filterData, setFilterData] = useState([
    {
      type: "Birim",
      open: true,
      datas: [
        { name: "Bilgisayar", chosen: false },
        { name: "Rektörlük", chosen: false },
        { name: "Kimya", chosen: false },
        { name: "Harita", chosen: false },
        { name: "Uçak", chosen: false },
        { name: "SKS", chosen: false },
      ],
    },
    {
      type: "Kategori",
      open: true,
      datas: [
        { name: "Tahta Eşya", chosen: false },
        { name: "Demir Eşya", chosen: false },
        { name: "Hırdavat", chosen: false },
      ],
    },
    //{ type: "Ürün Durumu", open: true },
    //{ type: "Tarih", open: true },
  ]);
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#0b377e",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0b377e",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#0b377e",
      },
      "&:hover fieldset": {
        borderColor: "#f7931d",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0b377e",
      },
    },
  });
  const paginationBarRef = useRef(null);
  const [isFixed, setIsFixed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const paginationBar = paginationBarRef.current;
      const paginationBarRect = paginationBar.getBoundingClientRect();
      const windowY = window.pageYOffset;

      // Sayfanın üst kısmından uzaklığı, pagination bar'ın yüksekliği kadarsa fixed
      if (paginationBarRect.top <= 0) {
        setIsFixed(true);
        paginationBar.style.top = "0px";
      }
      // Sayfanın altına kadar scroll edilmişse flex
      else if (
        window.innerHeight + windowY >=
        document.documentElement.scrollHeight
      ) {
        setIsFixed(false);
        paginationBar.style.top = "auto";
      }
      // Aksi halde fixed
      else {
        setIsFixed(true);
        paginationBar.style.top = "0px";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [Datas, setDatas] = useState([
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
    {
      name: "Sandalye",
      image: require("../assets/sandalye.jpg").default,
      category: "Tahta Eşya",
      status: "Az Kullanılmış",
      productCode: "B-00000000001",
      date: "02.04.2023",
    },
  ]);

  const keyFn = (data) => {
    return data.id;
  };

  const Config = [
    {
      label: "",
      render: (data) => (
        <div className=" w-fit">
          <img className=" w-24 h-24" src={imager} alt="product" />
        </div>
      ),
      image: true,
    },
    {
      label: "Ürün Kodu",
      render: (data) => (
        <>
          <div className="md:hidden opacity-40 font-Bold">Ürün Kodu:</div>
          {data.productCode}
        </>
      ),
      sortValue: (data) => data.productCode,
    },
    {
      label: "İsim",
      render: (data) => (
        <>
          <div className="md:hidden opacity-40 font-Bold">İsim:</div>
          {data.name}
        </>
      ),
      sortValue: (data) => data.name,
    },
    {
      label: "Kategori",
      render: (data) => (
        <>
          <div className="md:hidden opacity-40 font-Bold">Kategori:</div>
          {data.category}
        </>
      ),
      sortValue: (data) => data.category,
    },
    {
      label: "Durum",
      render: (data) => (
        <>
          <div className="md:hidden opacity-40 font-Bold">Durum:</div>
          {data.status}
        </>
      ),
      sortValue: (data) => data.status,
    },
    {
      label: "Tarih",
      render: (data) => (
        <>
          <div className="md:hidden opacity-40 font-Bold">Tarih:</div>
          {data.date}
        </>
      ),
    },
  ];

  const handleSearch = (data, isSearch) => {
    setPaginationNumber(1);
    setFilteredData(data);
    setIsSearch(isSearch);
  };

  const handleCheckboxChange = (dataIndex, includeIndex) => {
    setFilterData((prevFilterData) => {
      const newData = [...prevFilterData];
      newData[dataIndex].datas[includeIndex].chosen =
        !newData[dataIndex].datas[includeIndex].chosen;
      return newData;
    });
  };

  const handleFilterClick = (index) => {
    setFilterData((prevFilterData) => {
      const newData = [...prevFilterData];
      newData[index] = { ...newData[index], open: !newData[index].open };
      return newData;
    });
  };

  return (
    <div className="grid grid-cols-5 h-full">
      <div className="col-span-1 flex flex-col items-center w-full gap-4">
        <CssTextField
          label="Ara"
          id="custom-css-outlined-input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch className=" cursor-pointer" />
              </InputAdornment>
            ),
          }}
        />
        <button className=" font-semibold tracking-widest active:scale-75 transition-all duration-300 bg-secondary text-white rounded-lg  px-12 py-4  w-fit">
          Filtrele
        </button>
        {filterData.map((data, index) => {
          return (
            <>
              <button
                key={index}
                onClick={() => handleFilterClick(index)}
                className="flex hover:opacity-60 font-semibold text-main border-b-2 border-main py-[8px]  w-full justify-around"
              >
                <p>{data.type}</p>
                {data.open ? (
                  <IoIosArrowDown className=" w-6 h-6" />
                ) : (
                  <IoIosArrowUp className=" w-6 h-6" />
                )}
              </button>
              <div
                className={`${
                  data.open ? "max-h-[16rem]" : "h-[0rem] w-0"
                } transition-all duration-300 bg-[#F1F6F9] shadow-md border-2 rounded-lg  w-full overflow-y-scroll no-scrollbar`}
              >
                <FormGroup className="mt-2 ml-10 transition-all duration-300 ">
                  {data.datas.map((include, includeIndex) => {
                    console.log(include.name);
                    return (
                      <FormControlLabel
                        key={includeIndex}
                        control={
                          <Checkbox
                            checked={include.chosen}
                            onChange={() =>
                              handleCheckboxChange(index, includeIndex)
                            }
                            sx={{
                              color: "#cc123c",
                              "&.Mui-checked": {
                                color: "#cc123c",
                              },
                            }}
                          />
                        }
                        label={include.name}
                      />
                    );
                  })}
                </FormGroup>
              </div>
            </>
          );
        })}
      </div>
      <div className="w-full pl-8 flex flex-col items-center gap-4 col-span-4 relative">
        <SortableTable
          data={isSearch ? filteredData : Datas}
          config={Config}
          keyFn={keyFn}
          paginationNumber={paginationNumber}
        />
        <div
          ref={paginationBarRef}
          className="bg-fourth p-4 rounded-md shadow-lg"
          style={{ position: isFixed ? "fixed" : "static" }}
        >
          <PaginationBar
            elements={isSearch ? filteredData : Datas}
            info="Bu bilgilerde bir cihaz bulunamadı."
            paginationNumber={paginationNumber}
            setPaginationNumber={setPaginationNumber}
          />
        </div>
      </div>
    </div>
  );
}
