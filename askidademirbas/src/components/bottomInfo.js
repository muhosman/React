import { MdCopyright } from "react-icons/md";

export default function BottonInfo() {
  return (
    <div className=" bottom-0 w-screen  h-[10rem] bg-main">
      <div className="mx-[18rem] flex items-center h-full">
        <div className=" flex gap-2 items-center text-white text-lg">
          <p className=" ">Copyright </p>
          <MdCopyright className=" w-8 h-8" />
          <p> 2023 www.askidademirbas.com</p>
        </div>
      </div>
    </div>
  );
}
