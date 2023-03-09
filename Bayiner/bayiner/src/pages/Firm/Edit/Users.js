import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import SortableTable from "../../../components/SortableTable";
import PaginationBar from "../../../components/PaginationBar";
import { Blocks } from "react-loader-spinner";
import { useGetBelongUsersByFirmIDQuery } from "../../../store/firmApi";

function UpdateBill() {
  // INPUT FİELD
  const DesignFieldHeader =
    "font-SemiBold tracking-widest mb-2 xl:text-2xl md:text-XL text-BASE";

  const { auth } = useAuth();
  const token = auth.accessToken;
  const { id } = useParams();

  const [paginationNumber, setPaginationNumber] = useState(1);

  const [input, setInput] = useState({});
  const ResultBelongUsers = useGetBelongUsersByFirmIDQuery({ id, token });
  const Datas = ResultBelongUsers?.data?.data?.users || [];

  const config = [
    {
      label: " İsim",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">İsim:</div>
          {data.name}
        </>
      ),
      sortValue: (data) => data.name,
    },
    {
      label: " Soyisim",
      render: (data) => (
        <>
          <div className=" md:hidden opacity-40 font-Bold">Soyisim:</div>
          {data.lastName}
        </>
      ),
      sortValue: (data) => data.lastName,
    },
    {
      label: "İletişim",
      render: (data) => (
        <div className=" flex flex-col">
          <div className=" md:hidden opacity-40 font-Bold">İletişim:</div>

          <div>
            <text>Email: </text>
            {data.email}
          </div>
          <div>
            <text>Telefon: </text>
            {data.tel}
          </div>
        </div>
      ),
    },
  ];
  const keyFn = (data) => {
    return data.id;
  };
  useEffect(() => {
    setInput({
      ...input,
      token: token,
    });
  }, []);

  return (
    <div className=" grid w-full">
      <div className="flex flex-col md:flex-row border-b-4 border-fourth w-full h-fit mb-4">
        <text
          className={`flex items-center self-center w-full mb-2 ${DesignFieldHeader} `}
        >
          Kullanıcı Bilgileri
        </text>
      </div>

      {ResultBelongUsers.isFetching ? (
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
      ) : ResultBelongUsers?.data?.results === 0 ||
        ResultBelongUsers.isError === true ? (
        <div className=" text-SemiBold">
          Bu firmaya ait kullanıcı bulunamadı
        </div>
      ) : (
        <div className=" flex flex-col w-full gap-4 bg-white rounded-lg shadow-xl p-8 h-fit  transition-all duration-300">
          <div className="flex flex-col w-full items-center">
            <PaginationBar
              elements={Datas}
              info="Bu bilgilerde bir fatura bulunamadı."
              paginationNumber={paginationNumber}
              setPaginationNumber={setPaginationNumber}
            />
          </div>
          <div className=" w-full">
            <SortableTable
              data={Datas}
              config={config}
              keyFn={keyFn}
              paginationNumber={paginationNumber}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBill;
