"use client";

import React from "react";
import { ChevronDownCircle } from "lucide-react";
import LoadingMessage from "./LoadingMessage";

type Props = {
  messages: Message[];
};

function Messages({ messages }: Props) {
  return (
    <div className="flex flex-col h-[calc(100vh-160px)] py-10 px-64 overflow-auto hidden-scroll">
      <LoadingMessage />
      {!messages.length && (
        <>
          <div className="flex flex-col gap-10 flex-1 items-center justify-end ">
            <p className="animate-pulse text-gray-500">Start a conversation</p>
            <ChevronDownCircle
              size={64}
              className="animate-bounce text-gray-500"
            />
          </div>
        </>
      )}
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div className="text-right my-5">
              {message.sender && (
                <p className="message ml-auto rounded-br-none max-w-[80%] text-left">
                  {message.sender}
                </p>
              )}
            </div>
            <div>
              <p className="message bg-gray-800 rounded-bl-none">
                {message.systemResponse}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
