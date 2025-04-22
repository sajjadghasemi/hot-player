import { CSSProperties, useEffect, useRef, useState } from 'react';
import TrackArrowIcon from './icons/TrackArrowIcon';

interface ProgressControlProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  vtt: string;
}

type StoryboardCue = {
  start: number;
  end: number;
  image: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function parseVttTime(timeStr: string) {
  const [h, m, s] = timeStr.split(':');
  const [sec, ms] = s.split('.');
  return (
    Number(h) * 3600 +
    Number(m) * 60 +
    Number(sec) +
    (ms ? Number('0.' + ms) : 0)
  );
}

function parseStoryboardVtt(vtt: string): StoryboardCue[] {
  const cues: StoryboardCue[] = [];
  const lines = vtt.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('-->')) {
      const [start, end] = lines[i].split(' --> ').map(parseVttTime);
      const nextLine = lines[i + 1];
      if (nextLine) {
        const [img, xywh] = nextLine.split('#xywh=');
        const [x, y, w, h] = xywh.split(',').map(Number);
        cues.push({ start, end, image: img.trim(), x, y, w, h });
      }
    }
  }
  return cues;
}

function getStoryboardCue(time: number, cues: StoryboardCue[]) {
  return cues.find((cue) => time >= cue.start && time < cue.end);
}

const ProgressControl = ({
  currentTime,
  duration,
  onSeek,
  vtt,
}: ProgressControlProps) => {
  const [storyboardCues, setStoryboardCues] = useState<StoryboardCue[]>([]);
  const [storyboardUrl, setStoryboardUrl] = useState<string | null>(null);
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vtt) return;
    const baseUrl = vtt.substring(0, vtt.lastIndexOf('/') + 1);
    setStoryboardUrl(baseUrl);

    fetch(vtt)
      .then((res) => res.text())
      .then((text) => setStoryboardCues(parseStoryboardVtt(text)));
  }, [vtt]);

  const cue =
    previewTime !== null ? getStoryboardCue(previewTime, storyboardCues) : null;

  // Calculate clamped left position for the preview
  let previewLeft = 0;
  const PREVIEW_WIDTH = 192; // w-48 = 192px
  if (progressRef.current && previewTime !== null && duration > 0) {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = previewTime / duration;
    let left = percent * rect.width - PREVIEW_WIDTH / 2;
    left = Math.max(0, Math.min(left, rect.width - PREVIEW_WIDTH));
    previewLeft = left;
  }

  return (
    <div ref={progressRef} className="relative w-full">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          const time = Math.max(0, Math.min(duration, percent * duration));
          setPreviewTime(time);
          setShowPreview(true);
        }}
        onMouseLeave={() => setShowPreview(false)}
        className="w-full custom-player-progress cursor-pointer"
        style={
          {
            '--value': duration > 0 ? currentTime / duration : 0,
          } as CSSProperties
        }
        aria-label="Progress"
      />
      {showPreview && previewTime !== null && cue && storyboardUrl && (
        <div
          className="absolute bottom-16 hidden lg:block"
          style={{
            left: previewLeft,
            width: PREVIEW_WIDTH,
          }}
        >
          <div
            style={{
              backgroundImage: `url(${storyboardUrl}${cue.image})`,
              backgroundPosition: `-${cue.x}px -${cue.y}px`,
              backgroundSize: 'auto',
            }}
            className="w-48 h-auto aspect-video object-cover border-4 border-pink-800/70 rounded-lg relative"
          >
            <TrackArrowIcon className="absolute size-12 left-1/2 -translate-x-1/2 fill-white stroke-1 stroke-pink-800/70 -bottom-8" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressControl;
