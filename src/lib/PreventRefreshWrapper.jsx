import React, { useEffect } from "react";
import { focusManager } from "@tanstack/react-query";

/**
 * A component wrapper that prevents React Query from refetching
 * when the browser window or tab regains focus
 */
const PreventRefreshWrapper = ({ children }) => {
  useEffect(() => {
    // Completely disable focus-based refetching
    const originalFocused = focusManager.isFocused;
    focusManager.setFocused(false);

    // Intercept visibility changes
    const handleVisibilityChange = () => {
      // Don't allow the document's visibility state to trigger refetches
      if (document.visibilityState === "visible") {
        focusManager.setFocused(false);
      }
    };

    // Handle both focus and visibility events
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => focusManager.setFocused(false));

    return () => {
      // Restore original behavior
      focusManager.isFocused = originalFocused;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => {});
    };
  }, []);

  return <>{children}</>;
};

export default PreventRefreshWrapper;
