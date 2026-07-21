"use client";

import { useEffect, useState } from "react";
import { WifiOffIcon } from "./icons";

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê navigator.onLine, indisponível no prerender estático em Node
    setOffline(!navigator.onLine);
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="flex items-center justify-center gap-2 bg-surface py-1.5 font-mono text-xs uppercase tracking-wide text-text-secondary"
      role="status"
    >
      <WifiOffIcon className="h-3.5 w-3.5" />
      Modo offline
    </div>
  );
}
