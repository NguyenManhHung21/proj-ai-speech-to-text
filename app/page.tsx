"use client";

import Image from "next/image";
import Messages from "./components/Messages";
import Recorder, { mimeType } from "./components/Recorder";
import { useRef } from "react";

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

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
    <div className="bg-black h-screen overflow-y-auto">
      <form action="" className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          <Messages />
        </div>

        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" hidden ref={submitButtonRef} />
        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio} />
        </div>
      </form>
    </div>
  );
}
