import React from 'react';

export default function GamePage() {
  return (
    <div className="game-container" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe 
        src="/game-static/index.html" 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        title="Life of Duckie Game"
        allowFullScreen
      />
    </div>
  );
}
