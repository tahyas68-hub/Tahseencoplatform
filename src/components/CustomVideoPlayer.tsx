import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, PlayCircle } from "lucide-react";

interface CustomVideoPlayerProps {
  url: string;
  title?: string;
  watermarkText?: string;
}

export default function CustomVideoPlayer({ url, title, watermarkText }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const toggleTimeoutRef = useRef<NodeJS.Timeout>();

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (toggleTimeoutRef.current) return;
    
    setPlaying(prev => !prev);
    if (!hasStarted) setHasStarted(true);
    
    toggleTimeoutRef.current = setTimeout(() => {
      toggleTimeoutRef.current = undefined;
    }, 500);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [playing]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={toggleControls}
    >
      {/* Video Player */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
         <ReactPlayer
           ref={playerRef}
           url={url}
           width="100%"
           height="100%"
           playing={playing}
           muted={muted}
           controls={false}
           playsinline={true}
           onProgress={handleProgress}
           onEnded={() => setPlaying(false)}
           onPlay={() => {
              if (!hasStarted) setHasStarted(true);
              setPlaying(true);
           }}
           onPause={() => setPlaying(false)}
           config={{
             youtube: {
               playerVars: { modestbranding: 1, rel: 0, showinfo: 0, controls: 0, disablekb: 1, fs: 0, playsinline: 1 }
             },
             file: {
               attributes: {
                 playsInline: true,
                 controlsList: 'nodownload'
               }
             }
           }}
         />
      </div>

      {/* Video click area (shows controls on tap instead of pausing) */}
      <div 
        className="absolute inset-0 z-10"
      />

      {/* Initial Play Button Overlay (when video hasn't started) */}
      {!hasStarted && (
         <div 
           className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
           onClick={handlePlayPause}
         >
            <div className="w-20 h-20 bg-primary-600/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
               <Play className="w-10 h-10 ml-2" fill="currentColor" />
            </div>
         </div>
      )}

      {/* Top Gradient for Title (Optional) */}
      {showControls && title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-20 transition-opacity duration-300">
          <h3 className="text-white font-bold truncate text-right" dir="rtl">{title}</h3>
        </div>
      )}

      {/* Moving Watermark */}
      {watermarkText && playing && (
         <div className="absolute bottom-4 right-4 bg-black/80 text-white/80 font-mono text-sm px-3 py-1.5 rounded-lg pointer-events-none z-20 backdrop-blur-md border border-white/10 shadow-lg">
            {watermarkText}
         </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-30 transition-opacity duration-300 flex flex-col gap-2 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        dir="ltr"
      >
        <div className="flex items-center gap-2">
           <input
             type="range"
             min={0}
             max={0.999999}
             step="any"
             value={played}
             onChange={handleSeekChange}
             onMouseUp={handleSeekMouseUp}
             onTouchEnd={handleSeekMouseUp}
             className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
           />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayPause} className="text-white hover:text-primary-400 transition-colors">
              {playing ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6" fill="currentColor" />}
            </button>
            <button onClick={() => setMuted(!muted)} className="text-white hover:text-primary-400 transition-colors">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          <button onClick={toggleFullScreen} className="text-white hover:text-primary-400 transition-colors">
             <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
