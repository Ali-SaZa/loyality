import { useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";

import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";

import Button from "@/components/formElements/Button";
import { fileAddress } from "@/helpers";

export default function AudioPlayer({
  audioId,
  isUrl = false,
}: {
  audioId: string;
  isUrl?: boolean;
}) {
  const waveformRef = useRef<HTMLDivElement | null>(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: waveformRef,
    url: isUrl ? audioId : fileAddress(audioId, "audio"),
    waveColor: "#9EAADA",
    progressColor: "#364274",
    height: 50,
    barWidth: 1,
    barGap: 3,
    barHeight: 1.5,
    barRadius: 2,
    normalize: true,
    cursorWidth: 0,
  });

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="w-full flex items-center gap-4">
      <div ref={waveformRef} className="w-full" />
      <Button
        iconOnly
        className="rounded-full"
        size="lg"
        variant="flat"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <PauseIcon className="text-primary size-6" />
        ) : (
          <PlayIcon className="text-primary size-6" />
        )}
      </Button>
    </div>
  );
}
