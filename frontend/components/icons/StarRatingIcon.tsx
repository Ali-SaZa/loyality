export default function StarRatingIcon({
  className = "size-6",
  color = "white",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.64734 12.3213C9.22042 12.6406 6.48111 10.6167 5.95647 10.6123C5.43183 10.6078 2.66168 12.5852 2.23974 12.2587C1.8178 11.9323 2.80976 8.57925 2.65168 8.05551C2.4936 7.53177 -0.158652 5.38445 0.00748721 4.86343C0.173663 4.34241 3.52603 4.29402 3.95296 3.97474C4.37988 3.6555 5.51087 0.351063 6.03555 0.355473C6.56015 0.359921 7.64005 3.68303 8.06199 4.00948C8.48393 4.33589 11.8352 4.44096 11.9933 4.9647C12.1514 5.48845 9.46641 7.59067 9.30023 8.11169C9.13409 8.63271 10.0743 12.002 9.64734 12.3213Z"
        fill="url(#paint0_linear_3077_6953)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3077_6953"
          x1="1.536e-05"
          y1="6.35548"
          x2="12"
          y2="6.35548"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCD635" />
          <stop offset="1" stopColor="#F7A928" />
        </linearGradient>
      </defs>
    </svg>
  );
}
