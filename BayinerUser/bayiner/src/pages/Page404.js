const Page404 = () => {
  const button =
    "items-center gap-2 text-white active:text-white hover:text-fourth flex bg-fourth rounded-md px-4 py-2 active:bg-fourth hover:bg-white";

  return (
    <div>
      <div className=" fixed left-1/2 -translate-y-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className=" text-[24rem] -tracking-wides font-Bold text-fourth">
          404
        </div>
        <div className=" text-5xl text-fourth">
          Üzgünüz sayfa yüklenirken bir sorunla karşılaştık...
        </div>
      </div>
    </div>
  );
};

export default Page404;
