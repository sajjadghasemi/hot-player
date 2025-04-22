import { AnimatePresence, motion } from 'framer-motion';
import { CSSProperties, useState } from 'react';
import VolumeIcon from './icons/VolumeIcon';
import MutedIcon from './icons/MutedIcon';
import ControlButton from './ControlButton';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl = ({ onVolumeChange, volume }: VolumeControlProps) => {
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div
      className="flex items-center"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <ControlButton onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}>
        {volume > 0 ? (
          <VolumeIcon className="fill-white cursor-pointer size-4 md:size-6" />
        ) : (
          <MutedIcon className="fill-white cursor-pointer size-4 md:size-6" />
        )}
      </ControlButton>
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full custom-player-volume cursor-pointer"
              aria-label="Volume"
              style={
                {
                  '--value': volume,
                } as CSSProperties
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolumeControl;
