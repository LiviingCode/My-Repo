import axios from "axios";
import { Banner, FileContent } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const bannerService = {
  // Buscar lista de banners
  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await api.get<Banner[]>("/files");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar banners:", error);
      throw new Error("Falha ao carregar banners");
    }
  },

  // Download do arquivo do banner
  downloadBanner: async (fileName: string): Promise<FileContent> => {
    try {
      const response = await api.get(`/download/${fileName}`, {
        responseType: "blob",
      });

      return {
        data: response.data,
        contentType:
          response.headers["content-type"] || "application/octet-stream",
      };
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      throw new Error("Falha ao carregar arquivo");
    }
  },

  // Atualizar arquivo do banner
  updateBanner: async (
    originalFileName: string,
    file?: File,
    newFileName?: string
  ): Promise<void> => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (newFileName && newFileName !== originalFileName) {
        formData.append("name_file", newFileName);
      }

      // Sempre usar o nome original na URL para localizar o arquivo
      const response = await api.put(`/update/${originalFileName}`, formData);

      if (!response.status.toString().startsWith("2")) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar arquivo:", error);
      throw new Error("Falha ao atualizar arquivo");
    }
  },

  // Deletar arquivo do banner
  deleteBanner: async (fileName: string): Promise<void> => {
    try {
      const response = await api.delete(`/delete/${fileName}`);

      if (!response.status.toString().startsWith("2")) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      throw new Error("Falha ao deletar arquivo");
    }
  },
};
