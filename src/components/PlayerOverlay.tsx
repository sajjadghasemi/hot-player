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
import ExitFullScreenIcon from './icons/ExitFullScreenIcon';
import FullScreenIcon from './icons/FullScreenIcon';
import ControlButton from './ControlButton';
import VolumeControl from './VolumeControl';
import ProgressControl from './ProgressControl';
import SettingControl from './SettingControl';

interface PlayerOverlayProps {
  show: boolean;
  title: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: (amount: number) => void;
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  vtt: string;
  quality: string;
  setQuality: (q: string) => void;
  playbackRate: number;
  setPlaybackRate: (r: number) => void;
}

const PlayerOverlay = ({
  show,
  title,
  isPlaying,
  onPlayPause,
  onSkip,
  duration,
  currentTime,
  onSeek,
  isFullscreen,
  onToggleFullscreen,
  volume,
  onVolumeChange,
  vtt,
  quality,
  setQuality,
  playbackRate,
  setPlaybackRate,
}: PlayerOverlayProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: show ? 1 : 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="absolute player-custom-shadow inset-shadow-2xs inset-shadow-black inset-0 flex flex-col justify-between pointer-events-none"
  >
    <div className="flex justify-between items-center p-4 pointer-events-auto">
      <ControlButton onClick={() => console.log('Playlist clicked')}>
        <PlayListIcon
          className="rounded-full bg-transparent hover:bg-pink-800/70 transition-colors ease-in-out duration-500 p-1"
          iconClassName="size-10"
        />
      </ControlButton>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">{title}</span>
        <ControlButton onClick={() => console.log('Back clicked')}>
          <BackIcon
            className="bg-pink-800/70 rounded-xl size-10 flex items-center justify-center"
            iconClassName="size-5 fill-none"
          />
        </ControlButton>
      </div>
    </div>
    <div className="flex justify-center items-center gap-5 md:gap-8 pointer-events-auto">
      <ControlButton onClick={() => onSkip(-15)}>
        <SkipBackwardIcon
          className="bg-pink-800/70 rounded-3xl size-14 md:size-20 flex items-center justify-center"
          iconClassName="size-8 md:size-11 fill-none"
        />
      </ControlButton>
      <ControlButton onClick={onPlayPause}>
        {!isPlaying ? (
          <CenterPlayIcon
            className="bg-pink-800/70 rounded-4xl size-20 md:size-24 flex items-center justify-center"
            iconClassName="size-9 fill-white"
          />
        ) : (
          <CenterPauseIcon
            className="bg-pink-800/70 rounded-4xl size-20 md:size-24 flex items-center justify-center gap-x-2"
            iconClassName="w-4 md:w-5 fill-white"
          />
        )}
      </ControlButton>
      <ControlButton onClick={() => onSkip(15)}>
        <SkipForwardIcon
          className="bg-pink-800/70 rounded-3xl size-14 md:size-20 flex items-center justify-center"
          iconClassName="size-8 md:size-11 fill-none"
        />
      </ControlButton>
    </div>
    <div className="flex flex-col gap-2 p-4 pointer-events-auto">
      <ProgressControl
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
        vtt={vtt}
      />
      <div className="flex justify-between *:w-1/3 w-full">
        <div className="flex items-center gap-2">
          <span className="text-white">{formatTime(currentTime)}</span>
          <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <ControlButton onClick={() => onSkip(-15)}>
            <BackwardIcon className="fill-white size-4 md:size-6" />
          </ControlButton>
          <ControlButton onClick={onPlayPause}>
            {isPlaying ? (
              <PauseIcon className="fill-white size-6 md:size-8" />
            ) : (
              <PlayIcon className="fill-white size-6 md:size-8" />
            )}
          </ControlButton>
          <ControlButton onClick={() => onSkip(15)}>
            <ForwardIcon className="fill-white size-4 md:size-6" />
          </ControlButton>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <SettingControl
            quality={quality}
            setQuality={setQuality}
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
          />
          <ControlButton onClick={onToggleFullscreen}>
            {isFullscreen ? (
              <ExitFullScreenIcon className="fill-white size-4 md:size-6" />
            ) : (
              <FullScreenIcon className="fill-white size-4 md:size-6" />
            )}
          </ControlButton>
        </div>
      </div>
    </div>
  </motion.div>
);

function formatTime(time: number) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

export default PlayerOverlay;
