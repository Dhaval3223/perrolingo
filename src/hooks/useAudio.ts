import React, { useState, useEffect } from 'react';

const useAudio = (url: any) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    playing ? audio.play() : audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { playing, toggle };
};

export default useAudio;
