import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certificates } from './components/Certificates';
import { CreativeCorner } from './components/CreativeCorner';
import { Guestbook } from './components/Guestbook';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { playPixelSound } from './utils/sound';

export const App = () => {
  // Shared state for the interactive sticker reaction stamp tool
  const [activeSticker, setActiveSticker] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [placedStickers, setPlacedStickers] = useState([]);

  // Global viewport click/tap placement handler when sticker mode is armed
  const handleGlobalClick = (e) => {
    if (!activeSticker) return;

    // If clicking cancel button or sound toggle, don't place sticker
    if (e.target.closest('.cancel-box') || e.target.closest('.pixel-sound-checkbox')) {
      return;
    }

    // Intercept event to prevent accidentally clicking underlying links while stamping
    e.stopPropagation();

    const tilt = (Math.random() * 24 - 12).toFixed(1);
    const newSticker = {
      id: Date.now() + Math.random(),
      src: activeSticker.src,
      name: activeSticker.name,
      x: e.pageX,
      y: e.pageY,
      tilt: `${tilt}deg`,
      created: Date.now()
    };

    setPlacedStickers((prev) => [...prev, newSticker]);

    if (soundEnabled) {
      playPixelSound('pop');
    }

    // Sticker remains visible for ~5 seconds then fades away independently
    setTimeout(() => {
      setPlacedStickers((prev) => prev.filter((s) => s.id !== newSticker.id));
    }, 5000);
  };

  return (
    <div
      className={`app-root ${activeSticker ? 'sticker-mode-on' : ''}`}
      onClickCapture={activeSticker ? handleGlobalClick : undefined}
    >
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects
          activeSticker={activeSticker}
          soundEnabled={soundEnabled}
        />
        <Experience />
        <Certificates />
        <CreativeCorner />
        <Guestbook
          activeSticker={activeSticker}
          setActiveSticker={setActiveSticker}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
        <Contact />
      </main>

      <Footer />

      {/* Global Viewport Layer for Floating Placed Reactions */}
      <div className="global-floating-stickers-layer" aria-hidden="true">
        {placedStickers.map((sticker) => (
          <div
            key={sticker.id}
            className="floating-reaction-badge"
            style={{
              left: `${sticker.x}px`,
              top: `${sticker.y}px`,
              '--tilt': sticker.tilt
            }}
          >
            <img src={sticker.src} alt={sticker.name} className="floating-reaction-avatar" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
