"use client";
import React, { useRef, useState } from "react";

import PlayIcon from "../icons/PlayIcon";

import Button from "@/components/formElements/Button";
import { fileAddress } from "@/helpers";

const VideoPlayer = ({
  videoId,
  className = "",
  isUrl = false,
}: {
  videoId: string;
  className?: string;
  isUrl?: boolean;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  return (
    <div
      className={`relative rounded-xl shadow-xl max-h-[400px] w-full ${className}`}
    >
      {!isPlaying && (
        <div className="absolute w-full h-full top-0 bottom-0 left-0 right-0 flex items-center justify-center z-10 rounded-xl backdrop-blur-[8px]">
          <Button
            iconOnly
            className="rounded-full"
            size="lg"
            onClick={handlePlay}
          >
            <PlayIcon />
          </Button>
        </div>
      )}
      <video
        ref={videoRef}
        className={`rounded-xl w-full max-h-[400px] ${className}`}
        controls={isPlaying}
        src={isUrl ? videoId : fileAddress(videoId)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default VideoPlayer;
