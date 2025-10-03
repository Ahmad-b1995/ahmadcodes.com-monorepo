"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error in root layout:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Application Error
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                A critical error occurred. Please refresh the page or try again later.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400">
                  Error Details (Development)
                </summary>
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 overflow-auto max-h-48">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div className="mb-2">
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap text-xs">{error.stack}</pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
} 