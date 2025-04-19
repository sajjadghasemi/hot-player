const CenterPlayIcon = ({
  className,
  iconClassName,
}: {
  className: string;
  iconClassName: string;
}) => {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 46 52"
        className={iconClassName}
      >
        <path d="M42.1647 17.7257C42.1647 17.7257 48.3345 22.9841 45.0233 30.3621C41.7122 37.7401 18.267 53.0367 9.23854 51.9445C0.21008 50.8522 0.21008 32.9575 0.143241 30.7703C0.0764014 28.5832 -1.61001 2.76703 8.58814 0.241917C18.7863 -2.28319 40.6711 15.7467 42.1647 17.7257Z"></path>
      </svg>
    </div>
  );
};

export default CenterPlayIcon;
