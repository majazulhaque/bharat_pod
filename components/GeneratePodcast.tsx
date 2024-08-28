import { GeneratePodcastProps } from '@/types';
import React from 'react'

const GeneratePodcast = ({
  setAudioStorageId,
  setAudio,
  voiceType,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration
}:GeneratePodcastProps) => {
  return <div>{voiceType}</div>;
};

export default GeneratePodcast