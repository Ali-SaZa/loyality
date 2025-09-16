import { Link } from "@heroui/link";

interface LogoContainerProps {
  iconSize?: number;
  disableClick?: boolean;
}

const LogoContainer = ({
  iconSize = 100,
  disableClick = false,
}: LogoContainerProps) => {
  return (
    <Link
      className="flex items-center gap-2 cursor-pointer"
      href={disableClick ? "#" : `/`}
      style={{ width: iconSize + "px" }}
    >
      <img alt="مانا لوگو" src="/images/logo.png" />
    </Link>
  );
};

export default LogoContainer;
