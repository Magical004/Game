export interface AudioManager {
  setAudioEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  isAudioEnabled: () => boolean;
  isMusicEnabled: () => boolean;
}

export const createAudioManager = (initialAudio = true, initialMusic = true): AudioManager => {
  let audioEnabled = initialAudio;
  let musicEnabled = initialMusic;

  const setAudioEnabled = (enabled: boolean) => {
    audioEnabled = enabled;
  };

  const setMusicEnabled = (enabled: boolean) => {
    musicEnabled = enabled;
  };

  const isAudioEnabled = () => audioEnabled;
  const isMusicEnabled = () => musicEnabled;

  return { setAudioEnabled, setMusicEnabled, isAudioEnabled, isMusicEnabled };
};
