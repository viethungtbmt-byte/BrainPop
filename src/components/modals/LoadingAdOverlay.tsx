import React from "react";
import { RefreshCw } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface LoadingAdOverlayProps {
  isWatchingAd: boolean;
  t: Record<string, any>;
}

export const LoadingAdOverlay: React.FC<LoadingAdOverlayProps> = ({
  isWatchingAd,
  t,
}) => {
  if (!isWatchingAd) return null;

  return (
    <div
      id="loading-ad-dialog-backdrop"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        id="loading-ad-card"
        className="bg-gradient-to-b from-[#1b224c] to-[#121633] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center relative overflow-hidden flex flex-col items-center animate-scale-up"
      >
        <PanelBackground showTopBar={true} />
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center my-3 relative shadow-inner">
          <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-spin" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide my-1">
          {t.loadingAdText || "Loading Ad..."}
        </h3>
        <p className="text-xs text-slate-300/80 font-medium">
          {t.watchAdText || "Watch Ad"}
        </p>
      </div>
    </div>
  );
};
