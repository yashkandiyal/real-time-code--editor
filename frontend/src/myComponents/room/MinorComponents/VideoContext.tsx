import React, { createContext, useState, useContext, useRef } from 'react';

interface VideoContextType {
  videoOn: boolean;
  toggleVideo: () => void;
  videoStreamRef: React.RefObject<MediaStream>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoOn, setVideoOn] = useState(false);
  const videoStreamRef = useRef<MediaStream | null>(null);

  const toggleVideo = async () => {
    if (!videoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStreamRef.current = stream;
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    } else {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      videoStreamRef.current = null;
    }
    setVideoOn(prev => !prev);
  };

  return (
    <VideoContext.Provider value={{ videoOn, toggleVideo, videoStreamRef }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};