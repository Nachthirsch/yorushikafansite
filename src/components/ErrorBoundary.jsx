import React from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      console.error("Error caught by boundary:", error);
      setError(error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800">Something went wrong</h2>
        <pre className="mt-2 text-sm text-red-600">{error?.message}</pre>
      </div>
    );
  }

  return children;
}
