import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingIcon from './icons/SettingIcon';
import TrackArrowIcon from './icons/TrackArrowIcon';

interface SettingControlProps {
  quality: string;
  setQuality: (q: string) => void;
  playbackRate: number;
  setPlaybackRate: (r: number) => void;
}

const menuItems = [
  { id: 'quality', text: 'کیفیت' },
  { id: 'rate', text: 'سرعت پخش' },
];

const qualities = [
  { id: '1080p', text: '1080p' },
  { id: '720p', text: '720p' },
  { id: '480p', text: '480p' },
  { id: '360p', text: '360p' },
  { id: 'auto', text: 'خودکار (بسته به سرعت اینترنت شما)' },
];

const playbackRates = [
  { id: '0.5', text: '0.5x' },
  { id: '1', text: 'عادی' },
  { id: '1.5', text: '1.5x' },
  { id: '2', text: '2x' },
];

const SettingControl = ({
  quality,
  setQuality,
  playbackRate,
  setPlaybackRate,
}: SettingControlProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<'quality' | 'rate' | null>(null);

  const getQualityText = () =>
    qualities.find((q) => q.id === quality)?.text || '';
  const getRateText = () =>
    playbackRates.find((r) => +r.id === playbackRate)?.text || '';

  let items = menuItems;
  if (submenu === 'quality')
    items = [{ id: 'back', text: '← بازگشت' }, ...qualities];
  if (submenu === 'rate')
    items = [{ id: 'back', text: '← بازگشت' }, ...playbackRates];

  const handleItemClick = (id: string) => {
    if (id === 'back') {
      setSubmenu(null);
    } else if (submenu === null && (id === 'quality' || id === 'rate')) {
      setSubmenu(id as 'quality' | 'rate');
    } else if (submenu === 'quality') {
      setQuality(id);
      setOpen(false);
      setSubmenu(null);
    } else if (submenu === 'rate') {
      setPlaybackRate(+id);
      setOpen(false);
      setSubmenu(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 rounded-full hover:bg-pink-800/70 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <SettingIcon className="size-7 fill-white" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            key={submenu || 'main'}
            initial={{ opacity: 0, x: submenu ? 20 : 0, y: submenu ? 0 : 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: submenu ? 20 : 0, y: submenu ? 0 : 10 }}
            transition={{ duration: 0.15 }}
            className="absolute -right-6 md:right-0 bottom-10 z-30 w-auto min-w-4 md:min-w-6 bg-white rounded-xl p-1 md:p-2 shadow-lg border border-neutral-200"
          >
            {items.map((item) => (
              <button
                key={item.id}
                className={`w-full flex gap-x-2 md:gap-x-5 items-center justify-between cursor-pointer px-4 py-2 rounded-xl text-sm md:text-base font-normal md:font-bold whitespace-nowrap transition-colors duration-300 hover:bg-pink-800/70 text-gray-700 hover:text-white group`}
                onClick={() => handleItemClick(item.id)}
              >
                <span>{item.text}</span>
                {submenu === null && item.id === 'quality' && (
                  <span className="flex items-center gap-x-0.5 md:gap-x-2">
                    {getQualityText()}
                    <TrackArrowIcon className="size-6 fill-gray-700 group-hover:fill-white -rotate-90" />
                  </span>
                )}
                {submenu === null && item.id === 'rate' && (
                  <span className="flex items-center gap-x-0.5 md:gap-x-2">
                    {getRateText()}
                    <TrackArrowIcon className="size-6 fill-gray-700 group-hover:fill-white -rotate-90" />
                  </span>
                )}
                {submenu === 'quality' && (
                  <span
                    className={`size-5 rounded-full ring-8 ring-inset flex items-center justify-center transition-all duration-200 ${
                      item.id === quality
                        ? 'ring-pink-700/70 hover:ring-white'
                        : 'ring-gray-300 hover:ring-pink-700/70'
                    }`}
                  >
                    <span className="size-2.5 rounded-full bg-white group-hover:bg-pink-700/70"></span>
                  </span>
                )}
                {submenu === 'rate' && (
                  <span
                    className={`size-5 rounded-full ring-8 ring-inset flex items-center justify-center transition-all duration-200 ${
                      +item.id === playbackRate
                        ? 'ring-pink-700/70 hover:ring-white'
                        : 'ring-gray-300 hover:ring-pink-700/70'
                    }`}
                  >
                    <span className="size-2.5 rounded-full bg-white group-hover:bg-pink-700/70"></span>
                  </span>
                )}
              </button>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingControl;
