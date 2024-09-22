import React from "react";
import { Message } from "../page";
import { ChevronDownCircle } from "lucide-react";
import LoadingMessage from "./LoadingMessage";

type Props = {
  messages: Message[];
};

function Messages({ messages }: Props) {
  return (
    <div className="flex flex-col h-[calc(100vh-160px)] mobile:px-36 tablet:px-96 pc:px-[500px] overflow-auto pt-20 pb-10 px-10 mobile:p-10">
      <LoadingMessage />
      {!messages.length && (
        <div className="flex flex-col gap-10 flex-1 items-center justify-end ">
          <p className="animate-pulse text-gray-500">Start a conversation</p>
          <ChevronDownCircle
            size={64}
            className="animate-bounce text-gray-500"
          />
        </div>
      )}
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div>
              <p className="message bg-gray-800  rounded-bl-none">
                {message.response}
              </p>
            </div>
            <div className="text-right my-5">
              <p className="message ml-auto rounded-br-none">
                {message.sender}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
