<<<<<<< HEAD
import React from 'react';
=======
"use client";

import { useEffect } from "react";

export default function GameRedirect() {
  useEffect(() => {
    // Перенаправляем на игру внутри приложения, а не на прямой URL
    window.location.href = "/game-static/index.html";
  }, []);
>>>>>>> f8a246eeff6d35f0bca23ea9bee52120baf503f6

export default function GamePage() {
  return (
<<<<<<< HEAD
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
=======
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Загрузка игры...</p>
>>>>>>> f8a246eeff6d35f0bca23ea9bee52120baf503f6
    </div>
  );
}
