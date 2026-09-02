import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SahakarSeva ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black mb-2 text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            The application encountered a temporary error. Tap below to reload safely without losing your account.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
