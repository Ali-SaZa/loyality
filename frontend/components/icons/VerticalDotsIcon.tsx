export default function VerticalDotsIcon({
  className = "size-6",
  color = "#494949",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_410_2263)">
        <path
          d="M12 4C13.1046 4 14 3.10457 14 2C14 0.89543 13.1046 0 12 0C10.8954 0 10 0.89543 10 2C10 3.10457 10.8954 4 12 4Z"
          fill={color}
        />
        <path
          d="M12 14.0005C13.1046 14.0005 14 13.1051 14 12.0005C14 10.8959 13.1046 10.0005 12 10.0005C10.8954 10.0005 10 10.8959 10 12.0005C10 13.1051 10.8954 14.0005 12 14.0005Z"
          fill={color}
        />
        <path
          d="M12 23.9995C13.1046 23.9995 14 23.1041 14 21.9995C14 20.8949 13.1046 19.9995 12 19.9995C10.8954 19.9995 10 20.8949 10 21.9995C10 23.1041 10.8954 23.9995 12 23.9995Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_410_2263">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
