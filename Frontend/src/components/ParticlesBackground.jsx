import React, { useEffect, useState } from 'react';

const ParticlesBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 30 random particles
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 4 + 1; // 1px to 5px
      const left = Math.random() * 100; // 0% to 100%
      const animationDuration = Math.random() * 10 + 5; // 5s to 15s
      const animationDelay = Math.random() * 5; // 0s to 5s
      
      return {
        id: i,
        size,
        left,
        animationDuration,
        animationDelay,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles-container absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="animated-mesh-bg absolute inset-0 opacity-40"></div>
      
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: '-10px',
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
          }}
        />
      ))}
      
      {/* Overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030008] via-transparent to-[#030008]/50"></div>
    </div>
  );
};

export default ParticlesBackground;
