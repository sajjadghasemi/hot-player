import { motion } from 'framer-motion';
import CenterPlayIcon from './icons/CenterPlayIcon';
import CenterPauseIcon from './icons/CenterPauseIcon';
import SkipForwardIcon from './icons/SkipForwardIcon';
import SkipBackwardIcon from './icons/SkipBackwardIcon';
import BackIcon from './icons/BackIcon';
import PlayListIcon from './icons/PlayListIcon';
import BackwardIcon from './icons/BackwardIcon';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import ForwardIcon from './icons/ForwardIcon';
import SettingIcon from './icons/SettingIcon';
import ExitFullScreenIcon from './icons/ExitFullScreenIcon';
import FullScreenIcon from './icons/FullScreenIcon';
import VolumeIcon from './icons/VolumeIcon';

interface PlayerOverlayProps {
  show: boolean;
  title: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: (amount: number) => void;
  progress: number;
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const PlayerOverlay = ({
  show,
  title,
  isPlaying,
  onPlayPause,
  onSkip,
  progress,
  duration,
  currentTime,
  onSeek,
  isFullscreen,
  onToggleFullscreen,
  volume,
  onVolumeChange,
}: PlayerOverlayProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: show ? 1 : 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="absolute inset-0 flex flex-col justify-between pointer-events-none"
  >
    <div className="flex justify-between items-center p-4 pointer-events-auto">
      <button className="cursor-pointer">
        <PlayListIcon
          className="rounded-full bg-transparent hover:bg-pink-800/70 transition-colors ease-in-out duration-500 p-1"
          iconClassName="size-10"
        />
      </button>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">{title}</span>
        <button className="cursor-pointer transition-transform hover:scale-105">
          <BackIcon
            className="bg-pink-800/70 rounded-xl size-10 flex items-center justify-center"
            iconClassName="size-5 fill-none"
          />
        </button>
      </div>
    </div>
    <div className="flex justify-center items-center gap-5 md:gap-8 pointer-events-auto">
      <button
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSkip(-15)}
      >
        <SkipBackwardIcon
          className="bg-pink-800/70 rounded-3xl size-14 md:size-20 flex items-center justify-center"
          iconClassName="size-8 md:size-11 fill-none"
        />
      </button>
      <button
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <CenterPauseIcon
            className="bg-pink-800/70 rounded-4xl size-20 md:size-24 flex items-center justify-center gap-x-2"
            iconClassName="w-4 md:w-5 fill-white"
          />
        ) : (
          <CenterPlayIcon
            className="bg-pink-800/70 rounded-4xl size-20 md:size-24 flex items-center justify-center"
            iconClassName="size-9 fill-white"
          />
        )}
      </button>
      <button
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onSkip(15)}
      >
        <SkipForwardIcon
          className="bg-pink-800/70 rounded-3xl size-14 md:size-20 flex items-center justify-center"
          iconClassName="size-8 md:size-11 fill-none"
        />
      </button>
    </div>

    <div className="flex flex-col lg:flex-row-reverse gap-2 p-4 pointer-events-auto">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-pink-800 bg-transparent rounded-lg cursor-pointer"
      />
      <div className="flex justify-between text-white text-xs">
        <div className="flex items-center gap-2">
          <span>{formatTime(currentTime)}</span>
          <VolumeIcon />
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume ? volume : 0}
            onChange={(e) => {
              console.log(e.target.value);
              onVolumeChange(Number(e.target.value));
            }}
            className="w-16 hidden accent-pink-800 bg-transparent cursor-pointer"
            aria-label="Volume"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSkip(-15)}
          >
            <BackwardIcon />
          </button>
          <button
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={onPlayPause}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSkip(15)}
          >
            <ForwardIcon />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <SettingIcon />
          <button
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <span className="text-white text-xs">
                <ExitFullScreenIcon />
              </span>
            ) : (
              <span className="text-white text-xs">
                <FullScreenIcon />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default PlayerOverlay;
