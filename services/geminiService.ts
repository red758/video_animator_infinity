
import { GoogleGenAI, Type } from "@google/genai";
import { ScrollSection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateVideoStory(videoDescription: string): Promise<ScrollSection[]> {
  const prompt = `Act as a world-class creative director for a high-end digital agency. 
  Analyze this video concept: "${videoDescription}".
  
  Generate 5 distinct landing page sections that transform this video into a premium scroll-synchronized narrative.
  
  Requirements for each section:
  1. Title: 1-3 words, evocative and powerful (e.g., "UNSEEN DEPTHS", "KINETIC SOUL").
  2. Description: 15-25 words of high-end marketing copy that matches the visual vibe.
  3. triggerTime: A float between 0.05 and 0.95, perfectly spaced for narrative flow.
  4. alignment: Must vary between 'left', 'right', and 'center' to prevent repetitive layouts.
  5. vibe: Choose between:
     - 'cinematic': For sweeping, emotional moments (slow reveals).
     - 'energetic': For fast-paced, high-motion segments (sharp movements).
     - 'minimal': For quiet, atmospheric breathers (subtle presence).

  Return strictly as a JSON array of objects.`;

  try {
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
    if (!text) throw new Error("No response from Gemini");
    const sections = JSON.parse(text);
    return sections.sort((a: any, b: any) => a.triggerTime - b.triggerTime);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [
      { title: "THE AWAKENING", description: "In the quiet before the motion, every frame holds a promise of what is to come.", triggerTime: 0.1, alignment: 'left', vibe: 'cinematic' },
      { title: "VELOCITY", description: "Breaking the boundaries of still life. Experience the raw power of unbridled kinetic energy.", triggerTime: 0.35, alignment: 'right', vibe: 'energetic' },
      { title: "SILENCE", description: "A pause in the chaos. Finding clarity in the minimalist geometry of the moving image.", triggerTime: 0.55, alignment: 'center', vibe: 'minimal' },
      { title: "THE NEXUS", description: "Where color and light converge to create something entirely new and unexpected.", triggerTime: 0.75, alignment: 'left', vibe: 'cinematic' },
      { title: "ETERNITY", description: "Finality is just a perspective. The loop continues in the memory of the observer.", triggerTime: 0.92, alignment: 'right', vibe: 'energetic' },
    ];
  }
}
