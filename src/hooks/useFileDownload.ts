import { useState, useCallback } from "react";
import { FileContent } from "../types";
import { bannerService } from "../services/api";

export const useFileDownload = () => {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = useCallback(async (fileName: string) => {
    try {
      setLoading(true);
      setError(null);
      const content = await bannerService.downloadBanner(fileName);
      setFileContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar arquivo");
      setFileContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    setFileContent(null);
    setError(null);
  }, []);

  return {
    fileContent,
    loading,
    error,
    downloadFile,
    clearFile,
  };
};
