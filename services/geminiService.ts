
import { GoogleGenAI, Type } from "@google/genai";
import { ScrollSection } from "../types";

export async function generateVideoStory(videoDescription: string): Promise<ScrollSection[]> {
  // Safe environment check
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  const prompt = `Act as a world-class creative director for a high-end digital agency. 
  Analyze this video concept: "${videoDescription}".
  
  Generate 5 distinct landing page sections that transform this video into a premium scroll-synchronized narrative.
  
  Requirements:
  1. Title: 1-3 words, evocative and powerful.
  2. Description: 15-25 words of high-end marketing copy.
  3. triggerTime: Perfectly spaced (e.g., 0.15, 0.35, 0.55, 0.75, 0.9).
  4. alignment: Vary between 'left', 'right', 'center'.
  5. vibe: 'cinematic', 'energetic', or 'minimal'.

  Return strictly as a JSON array.`;

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
    if (!text) throw new Error("Empty response");
    const sections = JSON.parse(text);
    return sections.sort((a: any, b: any) => a.triggerTime - b.triggerTime);
  } catch (error) {
    console.warn("AI Synthesis bypassed, using default narrative core.", error);
    return [
      { title: "INITIAL PHASE", description: "Beginning the visual sequence with a focus on depth and atmospheric resonance.", triggerTime: 0.1, alignment: 'left', vibe: 'cinematic' },
      { title: "KINETIC FLOW", description: "Harnessing the raw motion within the frame to drive a high-energy user experience.", triggerTime: 0.3, alignment: 'right', vibe: 'energetic' },
      { title: "STATIC CALM", description: "A moment of architectural stillness, allowing the viewer to absorb the complexity of the scene.", triggerTime: 0.5, alignment: 'center', vibe: 'minimal' },
      { title: "CHROMATIC SYNC", description: "Exploring the interaction between light and shadow as the sequence nears its climax.", triggerTime: 0.7, alignment: 'left', vibe: 'cinematic' },
      { title: "FINALITY", description: "Closing the loop. The narrative returns to its origin, enriched by the journey through the visual spectrum.", triggerTime: 0.9, alignment: 'right', vibe: 'energetic' },
    ];
  }
}
