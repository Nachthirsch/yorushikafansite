import React, { useState, useRef, useEffect } from "react";

export default function SecureImage({ src, alt, className }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    // Add timestamp to bypass cache
    const imgUrl = new URL(src);
    imgUrl.searchParams.set("t", Date.now());

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Arial";
      ctx.rotate((-45 * Math.PI) / 180);

      // Add multiple watermarks
      for (let i = -canvas.width; i < canvas.width * 2; i += 100) {
        for (let j = -canvas.height; j < canvas.height * 2; j += 50) {
          ctx.fillText("© Yorushika", i, j);
        }
      }

      ctx.restore();

      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    img.src = imgUrl.toString();

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div className="bg-red-100/50 dark:bg-red-900/50 rounded-lg p-4 flex items-center justify-center">
        <p className="text-red-500 text-sm">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <canvas
        ref={canvasRef}
        className={`${className} ${isLoading ? "blur-sm" : ""}`}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-600" />
        </div>
      )}
    </div>
  );
}
