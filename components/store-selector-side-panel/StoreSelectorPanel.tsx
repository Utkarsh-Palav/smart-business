import { BellRing, CircleUser, MessageSquareMore } from "lucide-react";
import Image from "next/image";
import React from "react";

const StoreSelectorPanel = () => {
  return (
    <div className="max-w-20 px-2 py-3 border-r flex flex-col items-center justify-between">
      <div>
        <ul className="space-y-2">
          <li className="relative w-10 h-10 text-center bg-black text-white flex items-center justify-center rounded-xl">
            1
            <div className="absolute bg-green-600 w-3 h-3 rounded-full -bottom-0.5 -right-0.5" />
          </li>
          <li className="w-10 h-10 text-center bg-black text-white flex items-center justify-center rounded-xl">
            2
          </li>
          <li className="w-10 h-10 text-2xl text-center bg-black text-white flex items-center justify-center rounded-xl">
            +
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <MessageSquareMore className="text-gray-500" size={20}/>
        <BellRing className="text-gray-500" size={20}/>
        <Image src={'https://i.pinimg.com/736x/06/1c/f2/061cf2c0431f9acacdfc224b9700935d.jpg'} width={70} height={70} alt="User Logo" className=""/>
      </div>
    </div>
  );
};

export default StoreSelectorPanel;
