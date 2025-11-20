export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
// Extended aspect ratios for image generation as per prompt, mapping to nearest supported or string
export type ImageAspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";

export type VideoResolution = "720p" | "1080p";

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT'
}

export interface GeneratedAsset {
  id: string;
  type: MediaType;
  url?: string;
  thumbnailUrl?: string; // For videos
  prompt: string;
  timestamp: number;
  metadata?: string; // For analysis results
}
