export interface Banner {
  name: string;
  type: string;
}

export interface BannerResponse {
  data: Banner[];
}

export interface FileContent {
  data: Blob;
  contentType: string;
}

export type FileType = "image" | "pdf" | "video" | "document" | "other";
