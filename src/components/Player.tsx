'use client';

import {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  TouchEvent,
  MouseEventHandler,
} from 'react';
import Hls from 'hls.js';
import PlayerOverlay from './PlayerOverlay';
import { VastData, VideoData } from '@/app/page';

const Player = ({
  data,
  vastData,
}: {
  data: VideoData;
  vastData: VastData;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showAd, setShowAd] = useState(true);
  const [adCanSkip, setAdCanSkip] = useState(false);
  const [adVideoUrl, setAdVideoUrl] = useState<string | null>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playBackRateSetting, setPlayBackRateSetting] = useState(false);
  const [playBackRate, setPlayBackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const resetControlsTimeout = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const skip = (amount: number) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  };

  const adjustVolume = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.min(
        Math.max(videoRef.current.volume + amount, 0),
        1
      );
    }
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const openPlayBackSetting = () => {
    setPlayBackRateSetting(!playBackRateSetting);
  };

  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setPlayBackRate(rate);
    setPlayBackRateSetting(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleDoubleTap = (
    event: MouseEvent<HTMLVideoElement> | TouchEvent<HTMLVideoElement>
  ) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = video.getBoundingClientRect();
    const tapX =
      'clientX' in event ? event.clientX : event.touches?.[0]?.clientX;
    if (tapX !== undefined) {
      const middle = rect.left + rect.width / 2;
      tapX < middle ? skip(-10) : skip(10);
      resetControlsTimeout();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(
      !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
    );
  };

  const toggleFullscreen = async () => {
    try {
      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      if (!isCurrentlyFullscreen) {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        } else if (
          (playerContainerRef.current as any).webkitRequestFullscreen
        ) {
          (playerContainerRef.current as any).webkitRequestFullscreen(); // For Safari
        } else if ((playerContainerRef.current as any).mozRequestFullScreen) {
          (playerContainerRef.current as any).mozRequestFullScreen(); // For Firefox
        } else if ((playerContainerRef.current as any).msRequestFullscreen) {
          (playerContainerRef.current as any).msRequestFullscreen(); // For IE/Edge
        }

        if ((screen.orientation as any)?.lock) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (orientationError) {
            console.warn(
              'Orientation lock failed or unsupported:',
              orientationError
            );
          }
        }

        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }

        if (screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'MSFullscreenChange',
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleWaiting = () => setIsLoading(true);

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
      video?.play().catch((error) => {
        console.log(error);
      });
    };

    const handlePlay = () => setIsLoading(false);

    video?.addEventListener('waiting', handleWaiting);
    video?.addEventListener('canplay', handleCanPlay);
    video?.addEventListener('play', handlePlay);

    return () => {
      video?.removeEventListener('waiting', handleWaiting);
      video?.removeEventListener('canplay', handleCanPlay);
      video?.removeEventListener('play', handlePlay);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      switch (event.key) {
        case ' ':
          event.preventDefault();
          togglePlayPause();
          break;

        case 'ArrowRight':
          event.preventDefault();
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
          resetControlsTimeout();
          break;

        case 'ArrowLeft':
          event.preventDefault();
          video.currentTime = Math.max(video.currentTime - 10, 0);
          resetControlsTimeout();
          break;

        case 'ArrowUp':
          event.preventDefault();
          video.volume = Math.min(video.volume + 0.1, 1);
          resetControlsTimeout();
          break;

        case 'ArrowDown':
          event.preventDefault();
          video.volume = Math.max(video.volume - 0.1, 0);
          resetControlsTimeout();
          break;

        case 'm':
        case 'M':
          event.preventDefault();
          video.muted = !video.muted;
          resetControlsTimeout();
          break;

        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          resetControlsTimeout();
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    const handleClick = () => {
      resetControlsTimeout();
    };

    const handleTouchStart = () => {
      resetControlsTimeout();
    };

    if (videoElement) {
      videoElement.addEventListener('mousemove', handleMouseMove);
      videoElement.addEventListener('click', handleClick);
      videoElement.addEventListener('touchstart', handleTouchStart);
    }

    if (isPlaying) {
      resetControlsTimeout();
    } else {
      setShowControls(true);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('mousemove', handleMouseMove);
        videoElement.removeEventListener('click', handleClick);
        videoElement.removeEventListener('touchstart', handleTouchStart);
      }
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (showAd) setAdVideoUrl(null);
  }, [showAd]);

  useEffect(() => {
    if (!showAd) return;
    fetch(vastData.vast_url)
      .then((res) => res.text())
      .then((xmlString) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, 'application/xml');
        const mediaFile = xml.querySelector('MediaFile');
        if (mediaFile) {
          const cdata = mediaFile.textContent?.trim();
          if (cdata) setAdVideoUrl(cdata);
        }
      });
  }, [showAd, vastData.vast_url]);

  useEffect(() => {
    if (!showAd || !adVideoUrl) return;
    const playPromise = adVideoRef.current?.play();
    if (playPromise) {
      playPromise.catch((error) => {
        console.log(error);

        // Autoplay might be blocked, show a play button if needed
        // Optionally handle error here
      });
    }
  }, [adVideoUrl, showAd]);

  useEffect(() => {
    if (showAd) return;
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(data.manifest);
        hls.attachMedia(videoRef.current);
        videoRef.current.play();
      } else {
        videoRef.current.src = data.manifest;
      }
    }
  }, [showAd, data.manifest]);

  const handleAdEnd = () => setShowAd(false);
  const handleSkipAd = () => setShowAd(false);

  return (
    <div
      ref={playerContainerRef}
      className="fixed w-full h-screen top-0 left-0 flex justify-center items-center bg-black overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {showAd ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
          {adVideoUrl ? (
            <video
              ref={adVideoRef}
              src={adVideoUrl}
              autoPlay
              muted
              className="w-full aspect-video"
              onEnded={handleAdEnd}
              controls={false}
            />
          ) : (
            <div className="text-white">در حال بارگذاری تبلیغ...</div>
          )}
          <div className="absolute bottom-8 right-8">
            {adCanSkip && (
              <button
                onClick={handleSkipAd}
                className="bg-white text-black px-4 py-2 rounded"
              >
                {vastData.button_text || 'Skip Ad'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full aspect-video"
            onDoubleClick={handleDoubleTap}
            onTimeUpdate={handleProgress}
            onLoadedMetadata={handleLoadedMetadata}
            tabIndex={1}
            onMouseDown={() => handlePlaybackRate(2)}
            onMouseUp={() => handlePlaybackRate(1)}
            onTouchStart={() => handlePlaybackRate(2)}
            onTouchEnd={() => handlePlaybackRate(1)}
            controls={false}
            muted
          >
            <track />
          </video>
          <PlayerOverlay
            show={showControls}
            title={data.title}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSkip={skip}
            progress={progress}
            duration={duration}
            currentTime={currentTime}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            volume={videoRef.current?.volume || 0}
            onVolumeChange={adjustVolume}
            onSeek={(time) => {
              if (videoRef.current) videoRef.current.currentTime = time;
            }}
          />
        </>
      )}
    </div>
  );
};

export default Player;
