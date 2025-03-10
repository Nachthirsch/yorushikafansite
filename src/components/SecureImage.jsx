import React, { useState, useRef, useEffect } from "react";

// Static cache for preloaded images
const preloadCache = new Map();

export function preloadImage(src) {
  if (!src || preloadCache.has(src)) return;

  const img = new Image();
  img.crossOrigin = "anonymous";

  const imgUrl = new URL(src);
  imgUrl.searchParams.set("t", Date.now());

  img.src = imgUrl.toString();
  preloadCache.set(src, img);
}

export default function SecureImage({ src, alt, className, preload = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Effect for preloading only (no rendering)
  useEffect(() => {
    if (preload && src) {
      preloadImage(src);
    }
  }, [preload, src]);

  useEffect(() => {
    if (!src) return;

    const img = preloadCache.get(src) || new Image();
    imgRef.current = img;
    img.crossOrigin = "anonymous";

    // If not in cache already, set up the image source
    if (!preloadCache.has(src)) {
      const imgUrl = new URL(src);
      imgUrl.searchParams.set("t", Date.now());
      img.src = imgUrl.toString();
      preloadCache.set(src, img);
    }

    const onLoad = () => {
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

    const onError = () => {
      setError(true);
      setIsLoading(false);
    };

    // If image is already loaded from cache
    if (img.complete) {
      onLoad();
    } else {
      img.onload = onLoad;
      img.onerror = onError;
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      }
    };
  }, [src]);

  if (preload) return null; // Don't render anything for preload-only mode

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
