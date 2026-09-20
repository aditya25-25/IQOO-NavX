import { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCw, AlertTriangle, Home } from 'lucide-react';
import { IQOOLogo } from './IQOOLogo';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[IQOO NavX Global ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090A] text-[#F5F7F8] flex flex-col items-center justify-center p-6 select-none font-sans text-center">
          <div className="w-full max-w-sm bg-[#111315] border border-[#2B2F33] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-center gap-2">
              <IQOOLogo size="sm" variant="full" />
              <div className="h-4 w-px bg-[#2B2F33]" />
              <span className="font-extrabold text-base tracking-wider text-[#F5F7F8] font-display">
                NavX
              </span>
            </div>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-sm font-bold text-[#F5F7F8] font-display">
                Something went wrong while loading this view.
              </h2>
              <p className="text-xs text-[#A4A9AE]">
                IQOO NavX encountered a temporary error. Core offline navigation is ready to resume.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#e6bf00] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-colors font-display shadow-md cursor-pointer"
              >
                <RotateCw size={14} />
                <span>Retry</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="w-full py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] border border-[#2B2F33] text-[#F5F7F8] font-bold text-xs flex items-center justify-center gap-2 transition-colors font-display cursor-pointer"
              >
                <Home size={14} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
