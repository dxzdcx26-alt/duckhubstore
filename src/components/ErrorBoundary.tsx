import React, { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  state = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-white">เกิดข้อผิดพลาด</h2>
            <p className="text-sm text-neutral-400 font-mono break-all">{this.state.error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold text-sm cursor-pointer">
              โหลดใหม่
            </button>
          </div>
        </div>
      );
    }
    return (<>{this.props.children}</>);
  }
}
