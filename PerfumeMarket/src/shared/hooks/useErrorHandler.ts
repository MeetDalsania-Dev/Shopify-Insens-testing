import { useCallback, useState } from "react";
import { parseError } from "../lib/parseError";
import { AppError } from "../types/api.types";

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);

  const handleError = useCallback((err: unknown) => {
    const parsed = parseError(err);
    setError(parsed);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
};
