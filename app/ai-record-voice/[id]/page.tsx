"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import transcript from "@/actions/transcript";
import Recorder, { mimeType } from "@/app/components/Recorder";
import Messages from "@/app/components/Messages";
import { useParams } from "next/navigation";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { getConversation } from "@/app/api/conversation";
import { createMessage } from "@/app/api/message";

const initialState = {
  sender: null,
  systemResponse: "",
  id: "",
};

export default function RecordWithId() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useFormState(transcript, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams();

  const { data, isLoading } = useSWRImmutable(
    ["conversation", id],
    () => {
      if (typeof id === "string") return getConversation(id);
    },
    {
      onSuccess(data, key, config) {
        if (data) {
          console.log({ data });
          setMessages(data);
        }
      },
    }
  );

  const { trigger } = useSWRMutation(
    "new-msg",
    (url: string, { arg }: { arg: InputNewMessage }) => createMessage(arg)
  );

  useEffect(() => {
    if (data) setMessages(data);
  }, [id]);

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
    if (typeof id === "string" && !!state.systemResponse && !!state.sender) {
      trigger({ conversationId: id, message: state });
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
