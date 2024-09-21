"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import activeSiri from "@/app/img/active.gif";
import inactiveSiri from "@/app/img/inactive.png";
import { useFormStatus } from "react-dom";

type Props = {
  uploadAudio: (blob: Blob) => void;
};

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: Props) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    if (stream === null || pending) return;
    setRecordingStatus("recording");

    // Create a new media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType }); // need explain
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      console.log("data:", event.data);
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  console.log({ pending, permission, recordingStatus });
  return (
    <div className="flex items-center justify-center text-white">
      {!permission && (
        <button onClick={getMicrophonePermission}>Get Microphone</button>
      )}
      {pending && (
        <Image
          src={activeSiri}
          width={350}
          height={350}
          alt="Recording"
          priority
          className="assistant grayscale"
        />
      )}

      {permission && recordingStatus === "inactive" && !pending && (
        <Image
          src={inactiveSiri}
          width={350}
          height={350}
          alt="Not Recording"
          onClick={startRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}

      {recordingStatus === "recording" && (
        <Image
          src={activeSiri}
          width={350}
          height={350}
          alt="Recording"
          onClick={stopRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}
    </div>
  );
}

export default Recorder;
