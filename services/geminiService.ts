import { GoogleGenAI, Type } from "@google/genai";
import { ScrollSection } from "../types";

export async function generateVideoStory(videoDescription: string): Promise<ScrollSection[]> {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Act as a world-class creative director for 'Infinity', an AI startup. 
    Analyze this video: "${videoDescription}".
    
    The company vision is: "Infinity is an early-stage AI startup building next-generation intelligent systems that make advanced technology simple, natural, and accessible to everyone. We believe technology should have no limits."
    
    Generate 5 cinematic landing page sections (JSON array).
    Titles should be powerful (1-3 words). 
    Descriptions should be evocative (15-25 words).
    Use trigger times between 0.1 and 0.9.`;

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
    console.warn("Using bespoke Infinity fallback narrative.");
    
    // Updated fallback content specifically for the Infinity startup
    return [
      { 
        title: "NO LIMITS", 
        description: "Founded on the core belief that technology should have no boundaries. We are redefining the horizon of human potential.", 
        triggerTime: 0.12, 
        alignment: 'left', 
        vibe: 'cinematic' 
      },
      { 
        title: "NEXT-GEN SYSTEMS", 
        description: "Building intelligent systems that make advanced technology simple, natural, and accessible to every individual on the planet.", 
        triggerTime: 0.32, 
        alignment: 'right', 
        vibe: 'energetic' 
      },
      { 
        title: "SEAMLESS SYNC", 
        description: "Our AI-powered applications integrate invisibly into daily life, making the complex feel effortless and the future feel present.", 
        triggerTime: 0.52, 
        alignment: 'center', 
        vibe: 'minimal' 
      },
      { 
        title: "FOUNDATIONAL CORE", 
        description: "We operate at the source, building the fundamental systems required for future-scale innovation and global intelligence.", 
        triggerTime: 0.72, 
        alignment: 'left', 
        vibe: 'cinematic' 
      },
      { 
        title: "INFINITY AI", 
        description: "An early-stage vision led by independent innovation. We are just beginning to architect the next era of technology.", 
        triggerTime: 0.92, 
        alignment: 'right', 
        vibe: 'energetic' 
      },
    ];
  }
}