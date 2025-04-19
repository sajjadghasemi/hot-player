import Player from '@/components/Player';
import { Suspense } from 'react';

export interface VideoData {
  id: string;
  title: string;
  season: string;
  episode: string;
  description: string;
  status: string;
  image: string;
  preview: string | null;
  published_at: number;
  rate: {
    is_disliked: boolean;
    is_normal: boolean;
    is_liked: boolean;
    likes_count: number;
    dislikes_count: number;
    normals_count: number;
  };
  comments_count: number;
  manifest: string;
  length: number;
  visit_count: number;
  category: string | null;
  position: any[];
  channel: {
    id: string;
    title: string;
    title_en: string;
    imdb: string;
    year: string;
    description: string;
    username: string | null;
    image: string;
    cover: string;
    pinned_video: string;
    position: {
      id: number;
      slug: string;
      name: string;
      description: string;
      sequence: number;
      tags: string;
    }[];
    tags: string;
    position_tags: {
      id: number;
      slug: string;
      name: string;
      description: string;
      sequence: number;
      tags: string;
    }[];
    type: string;
    created_at: number;
    visit_count: number;
    comments_count: number;
    likes_count: number;
    _links: {
      self: { href: string };
      web: { href: string };
    };
  };
  files: any;
  allow_comments: boolean;
  tags: string;
  is_reshared: boolean;
  permission: string;
  sale: {
    is_for_sale: boolean;
  };
  hls_ready: boolean;
  playlist_sequence: number | null;
  vast_url: string;
  vast_object: {
    skip_duration: number;
    destination: string;
    button_text: string;
  };
  storyboard: Record<string, string>;
  storyboard_vtt: string;
  subtitle: string | null;
  _links: {
    self: { href: string };
    web: { href: string };
  };
}

export interface VastData {
  button_icon: string;
  button_color: string;
  text_color: string;
  cover_image: string;
  button_text: string;
  skip_duration: number;
  destination: string;
  vast_url: string;
  zone_id: number;
}

const getVideo = async (): Promise<VideoData> => {
  const res = await fetch('https://api.didimoon.com/v1/videos/oXnzwj4X', {
    headers: {
      'X-Api-Key':
        'zXPb2HKmckWozhqSzVg2Pk-yUSilnZMWP7ctA1Hu1k8jto09StgLigzYe23M',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

const getVast = async (): Promise<VastData> => {
  const res = await fetch('https://vast.didimoon.com/vast', {
    headers: {
      'X-Api-Key': '3d5f9da2c76e412a7e0911446001d878746a0d70',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function Home() {
  const data = await getVideo();
  const vastData = await getVast();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex flex-col w-full gap-y-5">
        <h1 className="text-3xl">Hot Player</h1>
        <Player data={data} vastData={vastData} />
      </main>
    </Suspense>
  );
}
