import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { SmartFoodAnalysis, DietPlan, UserHealthProfile, DailyStats } from "../types";

// Safely access the API key. 
// In some browser environments 'process' might be undefined, causing a ReferenceError.
const getApiKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return "";
};

const apiKey = getApiKey();

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey });

// --- Image Analysis Schema (Existing) ---
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    food_name: { type: Type.STRING, description: "Name of the food item." },
    food_type: { type: Type.STRING, enum: ["packaged", "fresh"] },
    expiry_status: {
      type: Type.OBJECT,
      properties: {
        expiry_date: { type: Type.STRING, description: "Extracted date or 'N/A'" },
        is_expired: { type: Type.STRING, description: "'yes', 'no', or 'near'" },
        days_left: { type: Type.STRING, description: "Estimated days left or 'Expired'" },
        comment: { type: Type.STRING, description: "Brief comment on expiry." }
      },
      required: ["expiry_date", "is_expired", "days_left", "comment"]
    },
    freshness: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, enum: ["fresh", "borderline", "spoiled", "unsafe"] },
        reason: { type: Type.STRING, description: "Visual evidence for status." }
      },
      required: ["status", "reason"]
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        summary_simple: { type: Type.STRING, description: "Simple explanation of nutrients." },
        highlights: {
          type: Type.OBJECT,
          properties: {
            sugar: { type: Type.STRING },
            salt: { type: Type.STRING },
            oil: { type: Type.STRING },
            additives: { type: Type.STRING }
          },
          required: ["sugar", "salt", "oil", "additives"]
        },
        suitable_for: {
          type: Type.OBJECT,
          properties: {
            kids: { type: Type.STRING },
            elders: { type: Type.STRING },
            diabetics: { type: Type.STRING },
            pregnant_women: { type: Type.STRING }
          },
          required: ["kids", "elders", "diabetics", "pregnant_women"]
        }
      },
      required: ["summary_simple", "highlights", "suitable_for"]
    },
    allergens: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of potential allergens (nuts, dairy, etc)" },
    health_risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific health warnings or food interaction alerts" },
    calories_estimation: { type: Type.STRING, description: "Estimated calories per typical serving" },
    fitness_tip: { type: Type.STRING, description: "Activity suggestion to burn these calories or health tip" },
    dietary_tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tags like 'Vegan', 'High Protein', 'Gluten Free'" },
    
    safety_rating: { type: Type.STRING, enum: ["safe", "caution", "avoid"] },
    cheaper_alternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          steps: { type: Type.STRING }
        },
        required: ["name", "steps"]
      }
    },
    storage_tips: { type: Type.STRING },
    shareable_summary: { type: Type.STRING, description: "A short paragraph summary for sharing." },
    ui_badges: {
      type: Type.OBJECT,
      properties: {
        safety_color: { type: Type.STRING, enum: ["green", "yellow", "red"] },
        expiry_color: { type: Type.STRING },
        freshness_color: { type: Type.STRING }
      },
      required: ["safety_color", "expiry_color", "freshness_color"]
    }
  },
  required: [
    "food_name", "food_type", "expiry_status", "freshness", 
    "nutrition", "allergens", "health_risks", "calories_estimation", 
    "fitness_tip", "dietary_tags", "safety_rating", "cheaper_alternatives", 
    "recipes", "storage_tips", "shareable_summary", "ui_badges"
  ]
};

// --- Diet Plan Schema ---
const dietPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    overview: { type: Type.STRING, description: "Brief explanation of why this plan fits the user." },
    calories_target: { type: Type.STRING, description: "e.g. '2000 kcal/day'" },
    daily_plans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_label: { type: Type.STRING },
          breakfast: { type: Type.STRING },
          lunch: { type: Type.STRING },
          dinner: { type: Type.STRING },
          snacks: { type: Type.STRING }
        },
        required: ["day_label", "breakfast", "lunch", "dinner", "snacks"]
      }
    },
    shopping_list: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["title", "overview", "calories_target", "daily_plans", "shopping_list"]
};

// --- 1. Food Analysis ---
export const analyzeFoodImage = async (base64Image: string, userNotes?: string): Promise<SmartFoodAnalysis> => {
  const model = "gemini-2.5-flash"; 

  const systemInstruction = `
    You are EatWise AI — a comprehensive Food Safety, Nutrition, and Lifestyle Assistant.
    Analyze food images for safety, freshness, and nutrition.
    Prioritize: Food Safety, Affordability, and Health.
  `;

  try {
    const prompt = userNotes 
      ? `Analyze this food image. Additional user notes: ${userNotes}` 
      : "Analyze this food image for safety, nutrition, allergies, fitness impact, and affordability.";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4
      }
    });

    if (!response.text) throw new Error("No response generated.");
    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// --- 2. Chatbot Service ---
let chatSession: Chat | null = null;

export const getChatResponse = async (message: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `
          You are 'EatWise Coach', a friendly and knowledgeable food & health assistant.
          You help users with:
          - Food safety advice
          - Healthy recipes and cooking tips
          - Nutrition explanations (simple language)
          - Diet tips (Weight loss, Muscle gain, etc.)
          
          Tone: Encouraging, non-judgmental, practical, and safe.
          Disclaimer: Always remind users you are an AI and not a doctor for medical issues.
          Keep answers concise and formatted with bullet points if needed.
        `
      }
    });
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm having trouble thinking right now. Try again?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I couldn't process that. Please try again.";
  }
};

// --- 3. Diet Plan Generator ---
export const getDietPlan = async (profile: UserHealthProfile): Promise<DietPlan> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Generate a 3-day simple meal plan for:
    Profile: Age ${profile.age}, ${profile.weight}kg, ${profile.height}cm.
    Goal: ${profile.goal}
    Preference: ${profile.dietary_pref}
    Allergies: ${profile.allergies || "None"}
    
    Make it affordable and easy to prepare.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dietPlanSchema
      }
    });
    
    if (!response.text) throw new Error("No plan generated.");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Diet Plan Error:", error);
    throw error;
  }
};

// --- 4. Health Insights ---
export const getHealthInsights = async (stats: DailyStats): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    User Daily Stats:
    - Water: ${stats.water_glasses} glasses
    - Calories Consumed: ${stats.calories_consumed}
    - Calories Burned: ${stats.calories_burned}
    - Mood: ${stats.mood}

    Give a 2-sentence encouraging health tip or analysis based on these stats.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "Keep going! You're doing great.";
  } catch (error) {
    return "Great job tracking your health today!";
  }
};