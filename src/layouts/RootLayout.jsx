import { Outlet } from "react-router-dom";
import { Aside } from "../components/client/Aside";
import { Head } from "../components/client/Head";
import { useState } from "react";

export const RootLayout = () => {
  const [respNav, SetRespNav] = useState(false);

  return (
    <main className="h-screen w-full overflow-hidden">
      {/* Top Header */}
      {/* <Head respNav={SetRespNav} /> */}
      <div className="h-screen w-full flex">
        {/* Sidebar */}
        <Aside respNav={respNav} SetRespNav={SetRespNav} />
        {/* Main Content */}
        <div className="w-full bg-[#DCD5D1] overflow-y-scroll scrollbar-hide md:w-9/12 lg:w-10/12">
          <Head respNav={SetRespNav} />
          <Outlet />
        </div>
      </div>
    </main>
  );
};
