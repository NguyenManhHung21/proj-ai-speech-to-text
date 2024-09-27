"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import activeSiri from "@/app/img/active.gif";
import inactiveSiri from "@/app/img/inactive.png";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";

type Props = {
  uploadAudio: (blob: Blob) => void;
};

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: Props) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (error) {
        console.log(error);
        toast.error("Permission denied", { toastId: "permission-deny-id" });
        return setPermission(false);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const checkForSpeech = async (audioBlob: Blob): Promise<boolean> => {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);

    let total = 0;

    for (let i = 0; i < channelData.length; i++) {
      total += Math.abs(channelData[i]);
    }

    const averageVolume = total / channelData.length;

    return averageVolume > 0.01;
  };

  const startRecording = async () => {
    if (mediaRecorder === null || stream === null) return;

    if (pending) return;

    setRecordingStatus("recording");

    // Create a new media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return "say nothing!";

      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      let audioBlob = new Blob(audioChunks, { type: mimeType });

      const hasSpeech = await checkForSpeech(audioBlob);
      if (!hasSpeech) {
        audioBlob = new Blob([], { type: mimeType });
      }

      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  return (
    <div className="flex items-center justify-center text-white">
      {permission === false ? (
        <button onClick={getMicrophonePermission} type="button">
          Get Microphone
        </button>
      ) : null}

      {permission && pending && (
        <Image
          src={activeSiri}
          width={350}
          height={350}
          alt="Recording"
          priority
          className="assistant grayscale"
        />
      )}

      {permission && recordingStatus === "inactive" && !pending ? (
        <Image
          src={inactiveSiri}
          width={350}
          height={350}
          alt="Not Recording"
          onClick={startRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      ) : null}

      {recordingStatus === "recording" ? (
        <Image
          src={activeSiri}
          width={350}
          height={350}
          alt="Recording"
          onClick={stopRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      ) : null}
    </div>
  );
}

export default Recorder;
