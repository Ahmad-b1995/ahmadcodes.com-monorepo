"use client";
import { useEffect } from "react";
import { ErrorFallback } from "@/components/ErrorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      onReset={() => {
        reset();
        window.location.reload();
      }}
      title="Something went wrong!"
      showDigest={true}
    />
  );
}