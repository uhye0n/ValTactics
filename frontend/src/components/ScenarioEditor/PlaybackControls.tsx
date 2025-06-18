import React from 'react';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  onPlay,
  onPause,
  onStop,
  onSeek
}) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    onSeek(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="playback-controls">
      <div className="controls-row">
        <div className="play-controls">
          <button
            className="control-button"
            onClick={onStop}
            title="정지"
          >
            ⏹️
          </button>
          
          <button
            className="control-button primary"
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        <div className="time-info">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
        </div>

        <div className="speed-control">
          <label>속도: {playbackSpeed}x</label>
        </div>
      </div>

      <div className="progress-row">
        <input
          type="range"
          className="progress-slider"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          step="0.1"
        />
      </div>
    </div>
  );
};

export default PlaybackControls;
