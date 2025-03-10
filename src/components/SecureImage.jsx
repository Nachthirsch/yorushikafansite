import React, { useState, useRef, useEffect } from "react";

export default function SecureImage({ src, alt, className }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Add a unique query parameter to bypass cache without triggering CORS issues
  const getUrlWithCacheBuster = (url) => {
    try {
      // Parse URL to add cache-busting parameter
      const urlObj = new URL(url);
      urlObj.searchParams.set("_t", Date.now());
      return urlObj.toString();
    } catch (e) {
      // If URL parsing fails, append the parameter directly
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}_t=${Date.now()}`;
    }
  };

  useEffect(() => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(false);

    const img = new Image();
    img.crossOrigin = "anonymous"; // Try with crossOrigin first
    imgRef.current = img;

    // Set up handlers before setting the source
    const onLoad = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Apply watermark
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
      // If CORS fails with crossOrigin="anonymous", try again without it
      if (img.crossOrigin) {
        console.warn("CORS request failed, trying without CORS");
        const newImg = new Image();
        imgRef.current = newImg;

        newImg.onload = () => {
          // For non-CORS images, we can't draw to canvas due to tainted canvas security,
          // so we'll just display the image directly with protective measures
          setIsLoading(false);

          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = 1;
            canvas.height = 1;
            ctx.clearRect(0, 0, 1, 1);
          }

          // Create a container div and append the image to it
          const container = document.createElement("div");
          container.style.width = "100%";
          container.style.height = "100%";
          container.style.position = "absolute";
          container.style.top = "0";
          container.style.left = "0";
          container.style.pointerEvents = "none";
          container.style.userSelect = "none";
          container.style.overflow = "hidden";

          newImg.style.width = "100%";
          newImg.style.height = "100%";
          newImg.style.objectFit = className?.includes("object-cover") ? "cover" : "contain";
          newImg.style.pointerEvents = "none";
          newImg.style.userSelect = "none";
          newImg.style.WebkitUserSelect = "none";
          newImg.style.WebkitTouchCallout = "none";
          newImg.alt = alt || "";

          container.appendChild(newImg);

          // Append to the parent of canvas
          if (canvasRef.current && canvasRef.current.parentNode) {
            canvasRef.current.parentNode.appendChild(container);
          }
        };

        newImg.onerror = () => {
          setError(true);
          setIsLoading(false);
        };

        // Try without CORS and without custom cache headers
        newImg.src = getUrlWithCacheBuster(src);

        return; // Exit this handler to avoid setting src again
      }

      // If we got here, both attempts failed
      setError(true);
      setIsLoading(false);
    };

    img.onload = onLoad;
    img.onerror = onError;

    // First try with CORS
    img.src = getUrlWithCacheBuster(src);

    return () => {
      // Clean up
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current = null;
      }

      // Clean up any direct image elements we might have created
      const canvas = canvasRef.current;
      if (canvas && canvas.parentNode) {
        const siblings = Array.from(canvas.parentNode.children);
        siblings.forEach((el) => {
          if (el !== canvas && el.tagName !== "DIV" && el.contains && el.contains(imgRef.current)) {
            canvas.parentNode.removeChild(el);
          }
        });
      }
    };
  }, [src, className]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="relative select-none"
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onContextMenu={handleContextMenu}
    >
      <canvas
        ref={canvasRef}
        className={`${className || ""} ${isLoading ? "invisible" : "visible"}`}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-600" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/50 dark:bg-red-900/50 rounded">
          <p className="text-red-500 dark:text-red-400 text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
}
