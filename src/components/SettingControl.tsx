import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingIcon from './icons/SettingIcon';

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
  { id: '1', text: '1x' },
  { id: '1.5', text: '1.5x' },
  { id: '2', text: '2x' },
];

const SettingControl = ({
  quality,
  setQuality,
  playbackRate,
  setPlaybackRate,
}: SettingControlProps) => {
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

  return (
    <div className="relative">
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
            className="absolute right-0 bottom-10 z-30 min-w-72 bg-white rounded-xl p-3"
          >
            {items.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between cursor-pointer text-left px-4 py-2 rounded-xl font-bold transition-colors duration-300
                  hover:bg-pink-800/70 text-gray-700 hover:text-white
                `}
                onClick={() => handleItemClick(item.id)}
              >
                <span>{item.text}</span>
                {submenu === null && item.id === 'quality' && (
                  <span className="text-xs text-pink-800 font-normal">
                    {getQualityText()}
                  </span>
                )}
                {submenu === null && item.id === 'rate' && (
                  <span className="text-xs text-pink-800 font-normal">
                    {getRateText()}
                  </span>
                )}
                {submenu === 'quality' && item.id === quality && (
                  <span className="text-xs text-pink-800 font-bold">✓</span>
                )}
                {submenu === 'rate' && +item.id === playbackRate && (
                  <span className="text-xs text-pink-800 font-bold">✓</span>
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
