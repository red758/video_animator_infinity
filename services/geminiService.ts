import { GoogleGenAI, Type } from "@google/genai";
import { ScrollSection } from "../types";

export async function generateVideoStory(videoDescription: string): Promise<ScrollSection[]> {
  try {
    // Attempt to initialize and use the AI, but don't throw early if key is missing.
    // This allows the 'catch' block to provide a fallback experience.
    if (!process.env.API_KEY) {
      throw new Error("API_KEY_MISSING: The environment variable is not defined.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Act as a world-class creative director. 
    Analyze this video concept: "${videoDescription}".
    Generate 5 distinct landing page sections (JSON array).
    Title: 1-3 words, description: 15-25 words, triggerTime: 0.1 to 0.9.`;

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
    // LOG THE ACTUAL ERROR to the console so the user can debug
    console.error("Narrative Synthesis Core Error:", error);
    
    // Provide a high-quality fallback so the app remains functional
    return [
      { title: "THE BEGINNING", description: "The journey commences within the frame. A study in motion and light as the narrative takes its first breath.", triggerTime: 0.15, alignment: 'left', vibe: 'cinematic' },
      { title: "KINETIC ENERGY", description: "Dynamics shift as the visual weight accelerates, pulling the viewer deeper into the conceptual core.", triggerTime: 0.35, alignment: 'right', vibe: 'energetic' },
      { title: "STILLNESS", description: "A moment of architectural pause. The sequence breathes, allowing every detail to resonate in high contrast.", triggerTime: 0.55, alignment: 'center', vibe: 'minimal' },
      { title: "EVOLUTION", description: "The patterns merge and evolve. Transitioning from the raw elements into a refined visual conclusion.", triggerTime: 0.75, alignment: 'left', vibe: 'cinematic' },
      { title: "FINAL FRAME", description: "Completion of the cycle. The narrative stabilizes, leaving a lasting impression of the temporal journey.", triggerTime: 0.95, alignment: 'right', vibe: 'energetic' },
    ];
  }
}