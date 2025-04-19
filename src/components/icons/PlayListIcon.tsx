const PlayListIcon = ({
  className,
  iconClassName,
}: {
  className: string;
  iconClassName: string;
}) => {
  return (
    <div className={className}>
      <svg
        className={iconClassName}
        viewBox="0 0 40 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 8H34"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M6 16H34"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M6 25H20"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M33.6677 25.9418C33.6165 25.9905 33.4253 26.1961 33.2457 26.3668C32.1977 27.4362 29.4614 29.1849 28.0299 29.72C27.8126 29.8054 27.263 29.9871 26.9684 30C26.6874 30 26.4189 29.9385 26.1629 29.8173C25.8432 29.6475 25.5882 29.3795 25.4472 29.0637C25.3574 28.8452 25.2164 28.1889 25.2164 28.177C25.0763 27.4601 25 26.2943 25 25.0055C25 23.7791 25.0763 22.6611 25.1912 21.9323C25.2038 21.9194 25.3448 21.1052 25.4984 20.8261C25.7795 20.3158 26.329 20 26.9173 20L26.9684 20C27.3519 20.0119 28.1574 20.3286 28.1574 20.3396C29.5126 20.8748 32.1842 22.539 33.2582 23.6451C33.2582 23.6451 33.5615 23.9297 33.6929 24.1068C33.8976 24.362 34 24.6778 34 24.9936C34 25.3461 33.8851 25.6738 33.6677 25.9418Z"
          fill="#FFD8F0"
        ></path>
      </svg>
    </div>
  );
};

export default PlayListIcon;
