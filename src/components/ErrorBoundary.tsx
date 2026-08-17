import React, { ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
      localStorage.removeItem("novel_match_memory_flip_state");
      localStorage.removeItem("novel_match_card_connection_state");
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0d101b] text-slate-100 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#1b224c] to-[#121633] border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              An unexpected error occurred. Tap below to reset the game state and recover instantly.
            </p>
            <button
              onClick={this.handleReset}
              className="mt-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset & Reload Game
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
