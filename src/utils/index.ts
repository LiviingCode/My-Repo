import { FileType } from "../types";

export const getFileType = (contentType: string): FileType => {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  if (contentType.startsWith("video/")) return "video";
  if (contentType.startsWith("text/") || contentType.includes("document"))
    return "document";
  return "other";
};

export const getFileIcon = (fileType: string) => {
  // Extrair apenas o tipo base (antes da /)
  const baseType = fileType.split("/")[0];

  switch (baseType) {
    case "image":
      return "🖼️";
    case "application":
      // Verificar se é PDF
      if (fileType.includes("pdf")) {
        return "📄";
      }
      return "📝";
    case "video":
      return "🎥";
    case "text":
      return "📝";
    default:
      return "📁";
  }
};

export const formatFileName = (name: string): string => {
  return name.length > 20 ? `${name.substring(0, 20)}...` : name;
};
