// src/pages/chat/VideoCallModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, roomName = "Business Room" }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Camera aur Mic Stream ko start karna
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopTracks();
    }

    return () => stopTracks();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Error accessing media devices.", err);
      setErrorMessage("Camera ya Microphone access nahi mil saka. Please permissions check karein.");
    }
  };

  // 2. Camera On/Off Toggle
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  // 3. Mic On/Off Toggle
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  // 4. Optional: Screen Share Feature
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        // Jab user browser se "Stop Sharing" click kare
        screenStream.getVideoTracks()[0].onended = () => {
          returnToCameraStream();
        };
        setIsScreenSharing(true);
      } else {
        returnToCameraStream();
      }
    } catch (err) {
      console.error("Error sharing screen", err);
    }
  };

  const returnToCameraStream = () => {
    if (localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
    setIsScreenSharing(false);
  };

  // 5. Tracks Stop karna jab call end ho
  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScreenSharing(false);
  };

  const handleEndCall = () => {
    stopTracks();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 bg-opacity-80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col h-[80vh]">
        
        {/* Top Bar */}
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">{roomName}</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Video Consultation
            </p>
          </div>
          <div className="text-sm font-mono text-gray-300 bg-gray-900 px-3 py-1 rounded-md">
            00:05:23
          </div>
        </div>

        {/* Video Screen Area */}
        <div className="flex-1 bg-gray-950 relative flex items-center justify-center p-4">
          {errorMessage ? (
            <div className="text-center text-gray-400 max-w-md p-4">
              <p className="text-red-400 font-medium mb-2">⚠️ Access Denied</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          ) : (
            <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900 relative border border-gray-800">
              {/* Main Local Stream Video */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted // Apni awaz khud ko double na sunayi de
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror view for local camera
              />

              {/* If camera is off, show avatar placeholder */}
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center flex-col">
                  <div className="w-24 h-24 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-gray-700 shadow-xl">
                    BN
                  </div>
                  <p className="text-gray-400 text-sm mt-4 font-medium">Your camera is turned off</p>
                </div>
              )}

              {/* Remote Mock Peer Stream Box (To simulate another person in the meeting) */}
              <div className="absolute bottom-4 right-4 w-48 h-32 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                  INV
                </div>
                <p className="text-[10px] text-gray-300 mt-2">Connecting Peer...</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Bar - Aligned with your Theme */}
        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-center items-center gap-4">
          
          {/* Toggle Audio */}
          <button
            onClick={toggleAudio}
            className={`p-3.5 rounded-full transition border ${
              isAudioOn 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 border-red-600 text-white'
            }`}
            title={isAudioOn ? "Mute Mic" : "Unmute Mic"}
          >
            {isAudioOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-full transition border ${
              isVideoOn 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 border-red-600 text-white'
            }`}
            title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-full transition border ${
              isScreenSharing 
                ? 'bg-primary-600 hover:bg-primary-700 border-primary-500 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
            }`}
            title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
          >
            {isScreenSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
          </button>

          {/* End Call Button */}
         <Button
            variant="primary"
             className="rounded-full !p-3.5"
            onClick={handleEndCall}
            title="End Call"
          >
            <PhoneOff size={22} />
          </Button>
          
        </div>

      </div>
    </div>
  );
};