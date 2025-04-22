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
import AdsOverlay from './AdsOverlay';

const Player = ({
  data,
  vastData,
}: {
  data: VideoData;
  vastData: VastData;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showAd, setShowAd] = useState(true);
  const [adVideoUrl, setAdVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(0);
  const [adDuration, setAdDuration] = useState(5);

  console.log(data);

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

  const adjustVolume = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = Math.min(Math.max(value, 0), 1);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
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
    const ac = new AbortController();
    const { signal } = ac;
    document.addEventListener('fullscreenchange', handleFullscreenChange, {
      signal,
    });
    document.addEventListener(
      'webkitfullscreenchange',
      handleFullscreenChange,
      { signal }
    );
    document.addEventListener('mozfullscreenchange', handleFullscreenChange, {
      signal,
    });
    document.addEventListener('MSFullscreenChange', handleFullscreenChange, {
      signal,
    });

    return () => {
      ac.abort();
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
          adjustVolume(Math.min(video.volume + 0.1, 1));
          resetControlsTimeout();
          break;

        case 'ArrowDown':
          event.preventDefault();
          adjustVolume(Math.max(video.volume - 0.1, 0));
          resetControlsTimeout();
          break;

        case 'm':
        case 'M':
          event.preventDefault();
          if (video.volume > 0) {
            adjustVolume(0);
          } else {
            adjustVolume(1);
          }
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
    const videoElementContainer = playerContainerRef.current;
    const ac = new AbortController();
    const { signal } = ac;

    const handleMouseMove = () => {
      resetControlsTimeout();
    };

    const handleClick = () => {
      resetControlsTimeout();
    };

    const handleTouchStart = () => {
      resetControlsTimeout();
    };

    if (videoElementContainer) {
      videoElementContainer.addEventListener('mousemove', handleMouseMove, {
        signal,
      });
      videoElementContainer.addEventListener('click', handleClick, { signal });
      videoElementContainer.addEventListener('touchstart', handleTouchStart, {
        signal,
      });
    }

    if (isPlaying) {
      resetControlsTimeout();
    } else {
      setShowControls(true);
    }

    return () => {
      if (videoElementContainer) {
        ac.abort();
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
        const durationTag = xml.querySelector('Duration');
        let durationSec = 5;
        if (durationTag) {
          const [h, m, s] = durationTag.textContent!.split(':').map(Number);
          durationSec = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
        }
        setAdDuration(durationSec);
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
      });
    }
  }, [adVideoUrl, showAd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onVolumeChange = () => setVolume(video.volume);
    video.addEventListener('volumechange', onVolumeChange);
    return () => video.removeEventListener('volumechange', onVolumeChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (showAd) return;
    if (!videoRef.current) return;

    const manifestUrl = data.manifest;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(manifestUrl);
      hls.attachMedia(videoRef.current);
      videoRef.current.play();
      setIsPlaying(true);
      videoRef.current.muted = false;
      adjustVolume(0.5);
    } else {
      videoRef.current.src = manifestUrl;
    }
  }, [showAd, quality, data.manifest]);

  const handleAdEnd = () => setShowAd(false);
  const handleSkipAd = () => setShowAd(false);

  return (
    <div
      ref={playerContainerRef}
      className="fixed w-full h-screen top-0 left-0 flex justify-center items-center bg-black overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {showAd ? (
        <AdsOverlay
          adVideoUrl={adVideoUrl}
          adDuration={adDuration}
          vastData={vastData}
          onSkip={handleSkipAd}
          onEnded={handleAdEnd}
          adVideoRef={adVideoRef}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full aspect-video"
            onLoadedMetadata={handleLoadedMetadata}
            tabIndex={1}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
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
            vtt={data.storyboard_vtt}
            show={showControls}
            title={data.title}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSkip={skip}
            duration={duration}
            currentTime={currentTime}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            volume={volume}
            onVolumeChange={adjustVolume}
            onSeek={(time) => {
              if (videoRef.current) videoRef.current.currentTime = time;
            }}
            quality={quality}
            setQuality={setQuality}
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
          />
        </>
      )}
    </div>
  );
};

export default Player;
