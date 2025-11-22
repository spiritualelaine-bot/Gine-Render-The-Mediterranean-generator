import { GoogleGenAI, Type } from "@google/genai";
import { ImageAspectRatio, VideoResolution } from "../types";

// Helper to ensure we have a key selected for paid features
async function ensureApiKey() {
  if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
}

// --- Image Analysis ---
export const analyzeImage = async (imageFile: File, prompt: string): Promise<string> => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = await fileToGenericBase64(imageFile);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
        { text: prompt || "Analyze this image for cinematic details, lighting, and historical accuracy." },
      ],
    },
  });

  return response.text || "No analysis generated.";
};

// --- Image Generation (Gemini 3 Pro Image) ---
export const generateCinematicImage = async (prompt: string, aspectRatio: ImageAspectRatio): Promise<string> => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Map complex aspect ratios to closest supported or pass strings if model supports them.
  // Gemini 3 Pro Image Preview supports standard ratios.
  // Note: 21:9 might not be natively supported by the enum in SDK but string pass-through usually works if model supports it.
  // If not, we fallback to 16:9.
  let targetRatio = aspectRatio;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: targetRatio as any, // Cast to any to allow the wide range of strings
        imageSize: "1K" // Defaulting to high quality
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// --- Image Editing (Nano Banana / Gemini 2.5 Flash Image) ---
export const editImageCinematic = async (imageFile: File, prompt: string): Promise<string> => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = await fileToGenericBase64(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image generated");
};

// --- Video Generation (Veo) ---
export const generateVeoVideo = async (
  prompt: string, 
  imageFile: File | null, 
  aspectRatio: "16:9" | "9:16"
): Promise<string> => {
  await ensureApiKey();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation;

  if (imageFile) {
    // Image-to-Video
    const base64Data = await fileToGenericBase64(imageFile);
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      image: {
        imageBytes: base64Data,
        mimeType: imageFile.type,
      },
      prompt: prompt, // Optional but recommended
      config: {
        numberOfVideos: 1,
        resolution: '720p', // fast-generate usually defaults to 720p
        aspectRatio: aspectRatio
      }
    });
  } else {
    // Text-to-Video
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });
  }

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");

  // Fetch the actual blob
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};


// --- Utilities ---

const fileToGenericBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};