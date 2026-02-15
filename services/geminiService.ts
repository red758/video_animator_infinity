
import { GoogleGenAI, Type } from "@google/genai";
import { ScrollSection } from "../types";

export async function generateVideoStory(videoDescription: string, brandName: string = "Narrative"): Promise<ScrollSection[]> {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Act as a world-class creative director for a brand called '${brandName}'. 
    Analyze this video: "${videoDescription}".
    Task: Create a 5-section narrative that connects the visuals in this video to the brand '${brandName}'.
    
    CRITICAL SPACING RULES:
    - Section 1: triggerTime around 0.15
    - Section 2: triggerTime around 0.35
    - Section 3: triggerTime around 0.55
    - Section 4: triggerTime around 0.75
    - Section 5: triggerTime around 0.90
    
    Generate 5 cinematic landing page sections (JSON array).
    - Titles: 1-3 powerful words (e.g. "BEYOND LIMITS").
    - Descriptions: 15-20 concise words.
    - Alignment: Vary (left, right, center).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              triggerTime: { type: Type.NUMBER },
              alignment: { type: Type.STRING, enum: ['left', 'right', 'center'] },
              vibe: { type: Type.STRING, enum: ['cinematic', 'minimal', 'energetic'] }
            },
            required: ["title", "description", "triggerTime", "alignment", "vibe"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response.");
    const sections = JSON.parse(text);
    return sections.sort((a: any, b: any) => a.triggerTime - b.triggerTime);

  } catch (error: any) {
    return [
      { 
        title: "SYSTEM_READY", 
        description: "Your engine is active. architect your cinematic narrative using the edit tools provided.", 
        triggerTime: 0.25, 
        alignment: 'center', 
        vibe: 'cinematic' 
      }
    ];
  }
}
