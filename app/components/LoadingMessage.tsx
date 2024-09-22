import React from "react";
import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

const LoadingMessage = () => {
  const { pending } = useFormStatus();
  return (
    pending && (
      <div className="message mb-5">
        <BeatLoader />
      </div>
    )
  );
};

export default LoadingMessage;
