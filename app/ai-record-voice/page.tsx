"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import transcript from "@/actions/transcript";
import Recorder, { mimeType } from "../components/Recorder";
import Messages from "../components/Messages";
import { createMessage, getAllConversation } from "../api/message";
import useSWRMutation from "swr/mutation";

const initialState = {
  sender: null,
  systemResponse: "",
  id: "",
};

export default function AIRecord() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useFormState(transcript, initialState);
  const [messages, setMessages] = useState<Message[]>([]);

  const { trigger } = useSWRMutation(
    "new-msg",
    (url: string, { arg }: { arg: InputNewMessage }) => createMessage(arg),
    {
      onSuccess(data, key, config) {
        recallConversations();
      },
    }
  );

  const { data, trigger: recallConversations } = useSWRMutation(
    "all-conversation",
    () => getAllConversation()
  );

  useEffect(() => {
    if (state.systemResponse && state.id) {
      setMessages((messages) => [
        {
          sender: state.sender,
          systemResponse: state.systemResponse || "",
          id: state.id || "",
        },
        ...messages,
      ]);
    }
    if (!!state.systemResponse && !!state.sender) {
      trigger({ conversationId: null, message: state });
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: mimeType }); // need explain
    // set the file as the value of the hidden file input field
    if (fileRef.current) {
      const dataTransfer = new DataTransfer(); // need explain
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;
    }

    // simulate a click & submit the form
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  };
  return (
    <div className="h-screen w-full">
      <form action={formAction} className="flex flex-col">
        <div className="flex-1">
          <Messages messages={messages} />
        </div>

        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" hidden ref={submitButtonRef} />
        <div>
          <Recorder uploadAudio={uploadAudio} />
        </div>
      </form>
    </div>
  );
}
