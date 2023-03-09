import { ImCross } from "react-icons/im";

const TopInfo = function ({ configTop, setInfo, Info, onClick }) {
  return (
    <div className="absolute lg:text-2xl md:text-XL sm:text-BASE top-0 bg-primary z-10 w-full flex justify-between h-fit">
      <div className="flex">
        {configTop.map((conf, index) => {
          return (
            <button
              onClick={() => setInfo(index)}
              className={`${
                Info === index
                  ? "bg-white border-primary "
                  : "bg-fourth text-white"
              } flex px-6 py-3 z-20 transition-all duration-500  
 hover:bg-white hover:text-fourth gap-4`}
            >
              <div className="flex justify-center items-center pt-2">
                {conf.tag}
                <p className="md:flex hidden">{conf.label}</p>
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onClick(false)}
        className={`flex px-8 py-2 transition-all duration-200  text-fourth
     h-14 z-10 justify-center items-center
    hover:text-fifth w-fit `}
      >
        <ImCross className="w-6 h-6 " />
      </button>
    </div>
  );
};

export default TopInfo;
