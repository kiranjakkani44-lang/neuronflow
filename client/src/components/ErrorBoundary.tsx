import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-8">
          <div className="bg-[var(--surface2)] border border-red-500/30 rounded-xl p-8 max-w-md text-center">
            <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-syne font-bold text-xl text-[var(--text)] mb-2">Something went wrong</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6 font-mono">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-bold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              <RefreshCw size={16} /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
