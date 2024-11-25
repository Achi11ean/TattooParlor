import React, { useEffect } from "react";

const FallingStars = ({ onComplete }) => {
  useEffect(() => {
    const starContainer = document.createElement("div");
    starContainer.className = "falling-stars-container";
    document.body.appendChild(starContainer);

    const generateStars = () => {
      for (let i = 0; i < 50; i++) {
        const star = document.createElement("div");
        star.className = "falling-star";
        star.style.left = `${Math.random() * 100}vw`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.animationDuration = `${3 + Math.random() * 2}s`;
        starContainer.appendChild(star);
      }
    };

    generateStars();

    // Cleanup and callback
    const timeout = setTimeout(() => {
      starContainer.remove();
      onComplete?.();
    }, 5000);

    return () => {
      clearTimeout(timeout);
      starContainer.remove();
    };
  }, [onComplete]);

  return null;
};

export default FallingStars;
