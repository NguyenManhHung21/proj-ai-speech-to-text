"use client";

import Link from "next/link";
import React, { useState } from "react";
import VipBadge from "./VipBadge";
import clsx from "clsx";
import { Arrow, Chat, Face, Image, Micro, Music } from "../json";
import Lottie from "lottie-react";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem, Button, cn } from "@nextui-org/react";
import useSWRImmutable from "swr/immutable";
import { getAllConversation } from "../api/message";
import { PencilIcon, VoicemailIcon } from "lucide-react";
type Props = {};

export const menuBar: MenuItem[] = [
  {
    text: "AI Record Voice",
    link: "/ai-record-voice",
    icon: <Lottie animationData={Micro} style={{ width: "25px" }} />,
    freTier: true,
  },
  {
    text: "Chat with AI",
    link: "#",
    icon: <Lottie animationData={Chat} style={{ width: "25px" }} />,
    freTier: false,
  },
  {
    text: "Generate Image",
    link: "#",
    icon: <Lottie animationData={Image} style={{ width: "25px" }} />,
    freTier: false,
  },
  {
    text: "Generate Music",
    link: "#",
    icon: <Lottie animationData={Music} style={{ width: "25px" }} />,
    freTier: false,
  },
  {
    text: "Swap Face ",
    link: "#",
    icon: <Lottie animationData={Face} style={{ width: "25px" }} />,
    freTier: false,
  },
];

const Sidebar = (props: Props) => {
  const [isExpand, setIsExpand] = useState(true);
  const pathname = usePathname();

  const { data, isLoading } = useSWRImmutable("all-conversation", () =>
    getAllConversation()
  );

  const renderMenu = () => {
    return menuBar.map((item) => {
      return (
        <Accordion
          selectionMode="multiple"
          itemClasses={{
            heading: "group",
          }}
          className="p-0 justify-center"
          key={item.text}
        >
          <AccordionItem
            isDisabled={!item.freTier}
            key={item.link}
            aria-label="menu"
            title={
              <div
                className={clsx(
                  "flex items-center gap-3",
                  !isExpand && "gap-0"
                )}
              >
                <div>{item.icon}</div>
                <div
                  className={clsx(
                    "flex items-center justify-between text-white transition-all",
                    isExpand
                      ? "min-w-[200px] opacity-100 duration-1000"
                      : "h-0 w-0 opacity-0 duration-0"
                  )}
                >
                  {item.text}
                  {!item.freTier && <VipBadge />}
                </div>
              </div>
            }
            className="p-0"
            disableIndicatorAnimation
            hideIndicator
            classNames={{
              trigger: ["justify-center"],
              title: [
                "p-4 hover:bg-[#303D89] rounded-xl text-base ",
                pathname === item.link && "bg-[#303D89]",
              ],
              content: "flex flex-col gap-3",
            }}
          >
            {item.freTier &&
              !!data &&
              data.map((child) => (
                <Link
                  href={`${item.link}/${child.conversationId}`}
                  className={cn(
                    "p-3 text-base text-white hover:bg-[#303D89] rounded-xl truncate",
                    pathname.endsWith(String(child.conversationId)) &&
                      "bg-[#303D89]"
                  )}
                  key={child.conversationId}
                >
                  {child.sender}
                </Link>
              ))}
          </AccordionItem>
        </Accordion>
      );
    });
  };
  return (
    <div className=" ">
      <div
        className={clsx(
          "relative h-screen overflow-auto max-w-[300px] bg-custom-linear-nav p-4 pt-6 shadow-lg shadow-indigo-500/50 duration-300",
          "flex flex-col items-center gap-4 hidden-scroll",
          isExpand ? "w-[300px]" : "w-20"
        )}
      >
        <button
          className="absolute top-0 left-0 p-2 rounded-tr-md rounded-br-md"
          onClick={() => setIsExpand(!isExpand)}
        >
          <Lottie animationData={Arrow} style={{ width: "30px" }} />
        </button>
        <Link
          href={"/ai-record-voice"}
          className="absolute top-2 right-1 hover:scale-110"
        >
          <PencilIcon color="white" />
        </Link>
        <div className="flex h-20 w-full items-center px-4">
          <Link
            className="transition-opacity group relative flex w-full items-center justify-center bg-transparent"
            href={"/"}
          >
            {isExpand ? (
              <>
                <div className="text-xl font-black uppercase opacity-25 transition-all group-hover:opacity-50 md:text-3xl">
                  Hungnm-AI
                </div>
                <div className="text-md absolute font-black uppercase transition-all group-hover:text-3xl md:text-2xl group-hover:md:text-3xl text-zinc-950">
                  <div className="bg-gradient-text bg-clip-text text-center font-bold text-transparent">
                    Hungnm-AI
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-black uppercase opacity-25 transition-all group-hover:opacity-50 md:text-3xl">
                  hug
                </div>
                <div className="text-md absolute font-black uppercase transition-all group-hover:text-3xl md:text-2xl group-hover:md:text-3xl text-zinc-950">
                  <div className="bg-gradient-text bg-clip-text text-center font-bold text-transparent">
                    hug
                  </div>
                </div>
              </>
            )}
          </Link>
        </div>
        {/* {menuBar.map((item) => (
          <Link
            key={item.text}
            className={clsx(
              "flex cursor-pointer items-center justify-start gap-3 rounded-xl p-4 text-base hover:bg-[#303D89] px-4",
              pathname === item.link && "bg-[#303D89]",
              !isExpand && "gap-0"
            )}
            href={item.link}
          >
            <div>{item.icon}</div>
            <div
              className={clsx(
                "flex items-center justify-between text-white transition-all",
                isExpand
                  ? "min-w-[200px] opacity-100 duration-1000"
                  : "h-0 w-0 opacity-0 duration-0"
              )}
            >
              {item.text}
              {!item.freTier && <VipBadge />}
            </div>
          </Link>
        ))} */}

        {renderMenu()}
      </div>
    </div>
  );
};

export default Sidebar;
