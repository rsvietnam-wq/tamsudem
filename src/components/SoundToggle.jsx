import { useState, useEffect } from 'react';
import { Howl } from 'howler';

export default function SoundToggle() {
  const [soundType, setSoundType] = useState('none'); // 'none', 'rain', 'lofi'
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // Clean up previous sound
    if (sound) {
      sound.stop();
    }

    // Create new sound based on selection
    if (soundType === 'rain') {
      const rainSound = new Howl({
        src: ['/sounds/rain.mp3'],
        loop: true,
        volume: volume,
      });
      setSound(rainSound);
      rainSound.play();
    } else if (soundType === 'lofi') {
      const lofiSound = new Howl({
        src: ['/sounds/lofi.mp3'],
        loop: true,
        volume: volume,
      });
      setSound(lofiSound);
      lofiSound.play();
    }

    // Cleanup on component unmount
    return () => {
      if (sound) {
        sound.stop();
      }
    };
  }, [soundType]);

  // Update volume when it changes
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
      <h4 className="text-sm font-serif text-white mb-3">Ambient Sound</h4>
      
      <div className="flex space-x-2 mb-3">
        <button
          className={`px-3 py-1 rounded-full text-xs ${soundType === 'none' ? 'bg-deep-blue text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSoundType('none')}
        >
          None
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs ${soundType === 'rain' ? 'bg-deep-blue text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSoundType('rain')}
        >
          Rain
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs ${soundType === 'lofi' ? 'bg-deep-blue text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSoundType('lofi')}
        >
          Lo-Fi
        </button>
      </div>
      
      {soundType !== 'none' && (
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}