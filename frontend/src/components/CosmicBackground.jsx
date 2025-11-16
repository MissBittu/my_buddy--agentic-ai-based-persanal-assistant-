import React, { useEffect, useRef } from "react";

const CosmicBackground = () => {
  const canvasRef = useRef(null);
  const stars = [];

  const createStars = (canvas, ctx) => {
    stars.length = 0;
    const numStars = 300;
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * w,
      });
    }
  };

  const draw = (canvas, ctx) => {
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "white";
    stars.forEach((star) => {
      star.z -= 2;
      if (star.z <= 0) star.z = w;

      const k = 128 / star.z;
      const px = star.x * k + w / 2;
      const py = star.y * k + h / 2;

      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        const size = (1 - star.z / w) * 2;
        ctx.fillRect(px, py, size, size);
      }
    });

    requestAnimationFrame(() => draw(canvas, ctx));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const init = () => {
      createStars(canvas, ctx);
      draw(canvas, ctx);
    };

    init();

    const handleResize = () => {
      createStars(canvas, ctx);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default CosmicBackground;
