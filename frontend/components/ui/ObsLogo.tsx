import { Link } from '@heroui/link'

interface LogoContainerProps {
  iconSize?: number
  disableClick?: boolean
}

const LogoContainer = ({ iconSize = 180, disableClick = false }: LogoContainerProps) => {
  return (
    <Link
      className="flex items-center gap-2 cursor-pointer"
      href={disableClick ? '#' : `/`}
      style={{ width: iconSize + 'px' }}
    >
      <img
        alt="obs logo"
        src="/images/logo.png"
      />
    </Link>
  )
}

export default LogoContainer
