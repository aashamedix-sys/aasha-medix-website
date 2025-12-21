
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] h-full flex items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-6 text-sm">
              The application encountered an unexpected error. We've logged this issue.
            </p>
            
            <Button 
              onClick={this.handleReset} 
              className="bg-red-600 hover:bg-red-700 w-full mb-4"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reload Page
            </Button>

            <details className="text-left mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <summary className="text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-700">
                View Error Details
              </summary>
              <pre className="mt-2 text-[10px] text-red-600 font-mono overflow-auto max-h-32 p-1 whitespace-pre-wrap break-all">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
