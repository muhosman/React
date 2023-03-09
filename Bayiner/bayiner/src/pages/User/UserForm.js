import Dropdown from "../../components/DropDown";
import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineSaveAlt } from "react-icons/md";

const UserForm = function ({
  input,
  HandleOpenModal,
  userRoles,
  handleSelectUserRoles,
  handleSelectFirmName,
  firmIds,
  Info,
  setInput,
  Edit,
}) {
  const textHeaderStyle =
    "ml-3 mb-2 font-Bold tracking-wider lg:text-2xl md:text-XL sm:text-BASE";
  return (
    <>
      {Info === 0 && (
        <form
          onSubmit={HandleOpenModal}
          className={` grid-flow-row w-screen h-screen z-0 overflow-y-scroll no-scrollbar md:px-32 sm:px-20 px-6 `}
        >
          <div className="grid sm:grid-cols-2 grid-cols-1 w-full h-fit sm:gap-y-[6rem] gap-y-[4rem] gap-x-5 my-32 overflow-hidden ">
            <div className="flex flex-col leading-8">
              <p className={`${textHeaderStyle}`}>Cihaz Tipi</p>
              <Dropdown
                options={userRoles}
                value={{
                  label: input.role,
                  value: input.role,
                }}
                onChange={handleSelectUserRoles}
                search={false}
                barValue={"-Kullanıcı Tipi-"}
              />
            </div>

            <div className="flex flex-col leading-8">
              <p className={`${textHeaderStyle}`}>Firma</p>

              <Dropdown
                options={firmIds}
                value={{
                  label: input.firmName,
                  value: input.firmName,
                }}
                onChange={handleSelectFirmName}
                search={true}
                barValue={"-Firma-"}
              />
            </div>
            <div>
              <p className={`${textHeaderStyle}`}>İsim</p>
              <input
                className="w-full h-12 input rounded-full shadow border-1 p-3"
                value={input.name}
                maxLength="25"
                required
                onChange={(e) => {
                  var value = e.target.value;
                  if (/^\d+$/.test(value)) return;
                  setInput({
                    ...input,
                    name: value,
                  });
                }}
              />
            </div>
            <div>
              <p className={`${textHeaderStyle}`}>Soyisim</p>
              <input
                className="w-full h-12 input rounded-full shadow border-1 p-3"
                value={input.lastName}
                maxLength="25"
                required
                onChange={(e) => {
                  var value = e.target.value;
                  if (/^\d+$/.test(value)) return;
                  setInput({
                    ...input,
                    lastName: value,
                  });
                }}
              />
            </div>
            <div>
              <p className={`${textHeaderStyle}`}>Email</p>
              {Edit === true ? (
                <input
                  className="w-full h-12 input rounded-full shadow border-1 p-3"
                  value={input.email}
                  maxLength="25"
                  disabled
                />
              ) : (
                <input
                  className="w-full h-12 input rounded-full shadow border-1 p-3"
                  value={input.email}
                  disabled
                />
              )}
            </div>
            <div>
              <p className={`${textHeaderStyle}`}>Telefon</p>
              <input
                className="w-full h-12 input rounded-full shadow border-1 p-3"
                value={input.tel}
                maxLength="25"
                required
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  var value = e.target.value;
                  setInput({
                    ...input,
                    tel: value,
                  });
                }}
              />
            </div>
            <div>
              <label className="flex px-3 mt-11">
                <input
                  type="checkbox"
                  className=" w-12 h-12"
                  checked={input.isActive}
                  onChange={() =>
                    setInput({
                      ...input,
                      isActive: !input.isActive,
                    })
                  }
                />
                <p className="ml-2 self-center">Durum</p>
              </label>
            </div>
            <button className="h-fit w-fit  items-center justify-self-end text-center text-fourth mt-11 flex bg-secondary rounded-br-2xl rounded-tl-2xl px-6 py-3 active:bg-primary  hover:bg-third transition-all duration-500">
              {Edit === true ? (
                <>
                  <AiOutlineSave className=" 2xl:w-12 2xl:h-12 w-8 h-8" />
                  <p className=" font-Bold tracking-wider lg:text-2xl md:text-BASE sm:text-SM">
                    Kaydet
                  </p>
                </>
              ) : (
                <>
                  <MdOutlineSaveAlt className=" 2xl:w-12 2xl:h-12 w-8 h-8" />
                  <p className=" font-Bold tracking-wider lg:text-2xl md:text-BASE sm:text-SM">
                    Ekle
                  </p>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default UserForm;
