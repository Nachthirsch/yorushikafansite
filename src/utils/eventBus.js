// Simple event bus for component communication

// Dispatch highlight mode change
export const setHighlightMode = (isActive) => {
  window.dispatchEvent(
    new CustomEvent("highlightModeChanged", {
      detail: { isHighlightMode: isActive },
    })
  );
};

// Listen for highlight mode changes
export const onHighlightModeChange = (callback) => {
  const handler = (event) => {
    if (event.detail && typeof event.detail.isHighlightMode === "boolean") {
      callback(event.detail.isHighlightMode);
    }
  };

  window.addEventListener("highlightModeChanged", handler);
  return () => window.removeEventListener("highlightModeChanged", handler);
};
