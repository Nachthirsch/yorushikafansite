import React from "react";

export default function SongFormDebug({ song }) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <details className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
      <summary className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">Debug Information</summary>
      <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-xs font-mono overflow-auto">
        <div>
          <strong>Description Field:</strong>
          <div className="pl-2">
            <div>Type: {typeof song.description}</div>
            <div>Value: "{song.description}"</div>
            <div>Length: {song.description?.length || 0}</div>
            <div>Is Empty: {!song.description || song.description.trim() === "" ? "true" : "false"}</div>
          </div>
        </div>
        <pre className="mt-2">{JSON.stringify(song, null, 2)}</pre>
      </div>
    </details>
  );
}
