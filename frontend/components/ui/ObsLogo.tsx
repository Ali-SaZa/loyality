import { Link } from '@heroui/link'

interface ObsLogoProps {
  iconSize?: number
  disableClick?: boolean
}

const ObsLogo = ({ iconSize = 180, disableClick = false }: ObsLogoProps) => {
  return (
    <Link
      className="flex items-center gap-2 cursor-pointer"
      href={disableClick ? '#' : `/`}
      style={{ width: iconSize + 'px' }}
    >
      <img
        alt="obs logo"
        src="/images/OBS.webp"
      />
    </Link>
  )
}

export default ObsLogo
