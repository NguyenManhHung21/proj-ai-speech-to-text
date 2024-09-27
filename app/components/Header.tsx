import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between fixed top-0 text-black w-full p-5 ">
      <div className="rounded-full overflow-hidden w-[50px] h-[50px]">
        <Image
          className="rounded-full"
          src="https://imgur.com/6mvtTuS.png"
          height={50}
          width={50}
          alt="my avatar"
        />
      </div>
    </div>
  );
};

export default Header;
