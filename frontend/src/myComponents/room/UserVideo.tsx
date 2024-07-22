import React, { useEffect, useRef, useState } from 'react';
import { useVideoContext } from './MinorComponents/VideoContext'; // Update import path

interface UserVideoProps {
  className?: string;
  width?: string;  // Accept width as a prop
  height?: string; // Accept height as a prop
}

const UserVideo: React.FC<UserVideoProps> = ({ className, width = 'w-32', height = 'h-24' }) => {
  const { videoOn, videoStreamRef } = useVideoContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoOn && videoStreamRef.current && videoElement) {
      videoElement.srcObject = videoStreamRef.current;
      videoElement.play().catch(err => console.error('Error playing video:', err));
    } else if (videoElement) {
      videoElement.srcObject = null;
    }
  }, [videoOn, videoStreamRef]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault(); // Prevent default drag behavior
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      setPosition(prev => ({
        top: prev.top + dy,
        left: prev.left + dx
      }));
      startPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className={`absolute ${width} ${height} bg-black border-4 border-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden shadow-lg z-50 ${className}`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={handleMouseDown}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default UserVideo;