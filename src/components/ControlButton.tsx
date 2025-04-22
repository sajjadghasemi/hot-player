import { ReactNode } from 'react';

const ControlButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      className="cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default ControlButton;
