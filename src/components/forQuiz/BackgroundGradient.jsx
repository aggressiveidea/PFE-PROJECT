<<<<<<< Updated upstream
import { useEffect, useRef } from "react"
import "./background-gradient.css"
=======
"use client";

import { useEffect, useRef } from "react";
import "./background-gradient.css";
>>>>>>> Stashed changes

const BackgroundGradient = ({ darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasDimensions = () => {
<<<<<<< Updated upstream
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawBlobs()
    }
=======
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Force redraw when resizing
      drawBlobs();
    };
>>>>>>> Stashed changes

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

<<<<<<< Updated upstream
    const blobs = []
    const blobCount = 4 
=======
    // Create gradient blobs
    const blobs = [];
    const blobCount = 4; // Increased for more visual interest
>>>>>>> Stashed changes

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 350 + 150, 
        xSpeed: (Math.random() - 0.5) * 0.3, 
        ySpeed: (Math.random() - 0.5) * 0.3,
        hue: Math.random() * 60 + (darkMode ? 240 : 220), 
        pulseSpeed: 0.005 + Math.random() * 0.005,
        pulseDirection: 1,
        pulseAmount: 0,
<<<<<<< Updated upstream
        originalRadius: 0, 
      })
=======
        originalRadius: 0, // Will be set in first draw
      });
>>>>>>> Stashed changes
    }
    const drawBlobs = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob, index) => {
  
        if (blob.originalRadius === 0) {
          blob.originalRadius = blob.radius;
        }

<<<<<<< Updated upstream
        blob.pulseAmount += blob.pulseSpeed * blob.pulseDirection
=======
        // Pulse effect
        blob.pulseAmount += blob.pulseSpeed * blob.pulseDirection;
>>>>>>> Stashed changes
        if (blob.pulseAmount > 0.2 || blob.pulseAmount < -0.1) {
          blob.pulseDirection *= -1;
        }
<<<<<<< Updated upstream
        const pulsedRadius = blob.originalRadius * (1 + blob.pulseAmount)

        blob.x += blob.xSpeed
        blob.y += blob.ySpeed

        const buffer = pulsedRadius * 0.5
        if (blob.x < -buffer) blob.x = canvas.width + buffer
        if (blob.x > canvas.width + buffer) blob.x = -buffer
        if (blob.y < -buffer) blob.y = canvas.height + buffer
        if (blob.y > canvas.height + buffer) blob.y = -buffer

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, pulsedRadius)
=======

        // Apply pulse to radius
        const pulsedRadius = blob.originalRadius * (1 + blob.pulseAmount);

        // Move blob
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // Bounce off edges with a buffer
        const buffer = pulsedRadius * 0.5;
        if (blob.x < -buffer) blob.x = canvas.width + buffer;
        if (blob.x > canvas.width + buffer) blob.x = -buffer;
        if (blob.y < -buffer) blob.y = canvas.height + buffer;
        if (blob.y > canvas.height + buffer) blob.y = -buffer;

        // Draw gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          pulsedRadius
        );
>>>>>>> Stashed changes

        if (darkMode) {
          gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 65%, 0.25)`);
          gradient.addColorStop(0.5, `hsla(${blob.hue}, 70%, 60%, 0.15)`);
          gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 60%, 0)`);
        } else {
          gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 85%, 0.2)`);
          gradient.addColorStop(0.5, `hsla(${blob.hue}, 70%, 80%, 0.1)`);
          gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 80%, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, pulsedRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawBlobs);
    };

    drawBlobs();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="background-gradient"
      aria-hidden="true"
    />
  );
};

export default BackgroundGradient;
