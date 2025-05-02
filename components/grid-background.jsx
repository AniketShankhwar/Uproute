"use client"

import React, { useEffect } from "react";
import "../app/globals.css"; // Ensure global styles are imported

const GridBackground = () => {
  useEffect(() => {
    // Create the glowing highlight element
    const highlight = document.createElement("div");
    highlight.classList.add("grid-highlight");
    document.body.appendChild(highlight);

    // Variables to manage morphing
    let morphInterval = null;
    let stopTimeout = null;

    // Function to update the glow’s size and shape for an "amoeba" effect
    function updateMorph() {
      const size = Math.random() * 100 + 250; // Randomize size between 250 and 350 pixels
      highlight.style.width = `${size}px`;
      highlight.style.height = `${size}px`;

      // Generate random border-radius values for an irregular shape
      const br1 = Math.random() * 50 + 13;
      const br2 = Math.random() * 50 + 10;
      const br3 = Math.random() * 50 + 13;
      const br4 = Math.random() * 50 + 10;
      highlight.style.borderRadius = `${br1}% ${br2}% ${br3}% ${br4}%`;
    }

    // Function to start the morphing interval
    function startMorphing() {
      if (morphInterval) return; // Already morphing
      morphInterval = setInterval(updateMorph, 300);
    }

    // Function to stop the morphing interval
    function stopMorphing() {
      if (morphInterval) {
        clearInterval(morphInterval);
        morphInterval = null;
      }
    }

    // Update position instantly on mouse move
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      highlight.style.left = `${x}px`;
      highlight.style.top = `${y}px`;
      // Fade in the highlight smoothly
      highlight.style.opacity = "0.8";
      startMorphing();

      // Clear any previous stop timer
      if (stopTimeout) clearTimeout(stopTimeout);
      // Set a timer to stop morphing after 300ms of inactivity
      stopTimeout = setTimeout(stopMorphing, 300);
    });

    // Smoothly fade out the glow when the mouse leaves the viewport
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget || e.relatedTarget.nodeName === "HTML") {
        highlight.style.opacity = "0"; // smooth fade out due to CSS transition
        stopMorphing();
      }
    });

    return () => {
      // Cleanup when component is unmounted
      document.body.removeChild(highlight);
      if (morphInterval) clearInterval(morphInterval);
      if (stopTimeout) clearTimeout(stopTimeout);
    };
  }, []);

  return (
    <div className="grid-background">
      {/* This element will be rendered with the grid background */}
    </div>
  );
};

export default GridBackground;
