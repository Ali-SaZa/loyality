import React from "react";

import JpgIcon from "../icons/JpgIcon";
import EpsIcon from "../icons/EpsIcon";
import PdfIcon from "../icons/PdfIcon";
import FilmIcon from "../icons/FilmIcon";
import FileCheckIcon from "../icons/FileCheckIcon";
import MusicIcon from "../icons/MusicIcon";
import LinkIcon from "../icons/LinkIcon";

interface DynamicIconProps {
  iconType: string;
  className?: string;
}

const DynamicIcon = ({ iconType, className = "size-6" }: DynamicIconProps) => {
  const hasType = (type: string) => iconType?.toLowerCase()?.includes(type);

  if (hasType("image"))
    return <JpgIcon className={className} />; //image
  else if (hasType("video"))
    return <FilmIcon className={className} />; //video
  else if (hasType("audio"))
    return <MusicIcon className={className} />; //audio
  else if (hasType("pdf"))
    return <PdfIcon className={className} />; //text
  else if (hasType("esp"))
    return <EpsIcon className={className} />; //esp
  else if (hasType("link"))
    return <LinkIcon className={className} />; //link
  else return <FileCheckIcon className={className} />; //file
};

export default DynamicIcon;
