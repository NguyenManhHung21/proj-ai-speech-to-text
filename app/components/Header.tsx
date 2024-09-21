import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between fixed top-0 text-black w-full p-5">
      <div className="rounded-full overflow-hidden w-[50px] h-[50px]">
        <Image
          className="rounded-full"
          src="https://imgur.com/6mvtTuS.png"
          height={50}
          width={50}
          alt="my avatar"
        />
      </div>
      <SettingsIcon
        size={40}
        className="p-2 m-2 rounded-full cursor-pointer bg-purple-600 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-purple-700 duration-300 hover:text-white"
      />
    </div>
  );
};

export default Header;
