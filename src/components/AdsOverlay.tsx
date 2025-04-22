import Link from 'next/link';
import { useEffect, useState } from 'react';
import MutedIcon from './icons/MutedIcon';
import { AnimatePresence, motion } from 'framer-motion';

interface AdOverlayProps {
  adVideoUrl: string | null;
  adDuration: number;
  vastData: {
    button_text?: string;
    destination?: string;
  };
  onSkip: () => void;
  onEnded: () => void;
  adVideoRef: React.RefObject<HTMLVideoElement | null>;
}

const AdsOverlay: React.FC<AdOverlayProps> = ({
  adVideoUrl,
  adDuration,
  vastData,
  onSkip,
  onEnded,
  adVideoRef,
}) => {
  const [adCountdown, setAdCountdown] = useState(adDuration);
  const [adCanSkip, setAdCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleUnmuteTap = () => {
    if (adVideoRef.current) {
      adVideoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  useEffect(() => {
    setAdCountdown(adDuration);
    setAdCanSkip(false);
    if (adDuration <= 0) {
      setAdCanSkip(true);
      return;
    }
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [adDuration]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
      {adVideoUrl ? (
        <video
          ref={adVideoRef}
          src={adVideoUrl}
          autoPlay
          muted
          className="w-full aspect-video"
          onEnded={onEnded}
        />
      ) : (
        <div className="text-white">در حال بارگذاری تبلیغ...</div>
      )}

      <AnimatePresence>
        {isMuted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleUnmuteTap}
            className="absolute flex items-center justify-center cursor-pointer left-1/2 right-1/2 -translate-x-1/2 bg-black/60 size-32 rounded-full z-30"
          >
            <MutedIcon className="size-14 fill-white/90" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 md:bottom-1/5 flex justify-between items-center w-full">
        {vastData.destination && (
          <Link
            href={vastData.destination}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/70 text-white text-sm md:text-base font-bold text-center w-24 md:w-32 py-2 border-2 border-l-0 border-white rounded-r-xl"
          >
            اطلاعات بیشتر
          </Link>
        )}
        <span
          onClick={
            adCanSkip
              ? () => {
                  onSkip();
                  if (adVideoRef.current) {
                    adVideoRef.current.pause();
                  }
                }
              : undefined
          }
          className="bg-black/70 text-center cursor-pointer text-white text-sm md:text-base font-bold w-24 md:w-32 py-2 border-2 border-r-0 border-white rounded-l-xl"
        >
          {adCountdown > 0 ? `${adCountdown} تا رد کردن` : 'رد کردن'}
        </span>
      </div>
    </div>
  );
};

export default AdsOverlay;
