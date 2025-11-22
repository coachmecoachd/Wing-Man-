
// ...existing code...
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PersonProfile, Message, DatingAdviceResponse, DateOption } from '../types';
// ...existing code...

import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PersonProfile, Message, DatingAdviceResponse, DateOption, GiftIdea } from '../types';
// ...existing code...

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const getReplySuggestion = async (messages: Message[]): Promise<string> => {
  try {
    const gemini = getAiClient();
    const conversationHistory = messages.map(m => `${m.sender === 'me' ? 'Me' : 'Them'}: ${m.text}`).join('\n');
    const prompt = `
<<<<<<< HEAD
      You are Wing Man, a dating assistant AI. Your goal is to help users craft engaging, respectful, and charming replies in their dating conversations.
=======
      You are BRUH, an AI Wingman. Your goal is to help users craft engaging, respectful, and charming replies in their dating conversations.
>>>>>>> 7a3b66c (Update README with correct repo info)
      Analyze the following conversation and suggest a great reply for "Me". 
      Provide 2-3 distinct options, each with a brief explanation of the vibe (e.g., "Playful & Witty", "Direct & Confident", "Curious & Engaging").
      Format the response in Markdown.

      Conversation History:
      ${conversationHistory}
      
      Suggest a reply for "Me":
      `;
    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
<<<<<<< HEAD
    return response.text;
=======
    return response.text ?? "";
>>>>>>> 7a3b66c (Update README with correct repo info)
  } catch (error) {
    console.error("Error getting reply suggestion:", error);
    throw new Error("Failed to get reply suggestion from AI.");
  }
};

export const generateDateIdeas = async (profile: PersonProfile, userZip?: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const locationContext = userZip ? `The user is located in or near zip code ${userZip}. Please prioritize local venues or activities in this area if specific locations are mentioned.` : '';
        
        const prompt = `
        Based on this person's profile, suggest 3 creative and personalized date ideas. For each idea, provide a title, a brief description, and why it's a good fit for them.
        ${locationContext}
        
        **Profile:**
        - **Name:** ${profile.name}
        - **Description:** ${profile.description}
        - **Likes:** ${profile.likes}
        - **Dislikes:** ${profile.dislikes}
        - **Hobbies:** ${profile.hobbies}
        - **Occupation:** ${profile.occupation}
        ${profile.zipCode ? `- **Their Location (Zip):** ${profile.zipCode}` : ''}
        
        Format your response in Markdown.
        `;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
<<<<<<< HEAD
        return response.text;
=======
        return response.text ?? "";
>>>>>>> 7a3b66c (Update README with correct repo info)
    } catch (error) {
        console.error("Error generating date ideas:", error);
        throw new Error("Failed to generate date ideas.");
    }
};

export const generateStructuredDateIdeas = async (
    zipCode: string, 
    dateTime: string, 
    profile?: PersonProfile
): Promise<DateOption[]> => {
    try {
        const gemini = getAiClient();
        
        let profileContext = "";
        if (profile) {
            profileContext = `
            The date is with: ${profile.name}.
            Their Profile:
            - Description: ${profile.description}
            - Likes: ${profile.likes}
            - Dislikes: ${profile.dislikes}
            - Hobbies: ${profile.hobbies}
            `;
        } else {
            profileContext = "No specific profile selected. Suggest generally great date ideas.";
        }

        const prompt = `
        Plan 4 distinct, creative, and specific date options for Zip Code: ${zipCode} on Date/Time: ${dateTime}.
        
        ${profileContext}
        
        Instructions:
        import { GoogleGenAI, Modality, Type } from "@google/genai";
        import { PersonProfile, Message, DatingAdviceResponse, DateOption, GiftIdea } from '../types';
        import { GiftIdea } from '../types';
        - Ensure the ideas fit the time of day (e.g., don't suggest a breakfast place for a 8 PM date).
        - Provide a diverse range of options (e.g. one active, one dining, one cultural/relaxed).
        
        Return a JSON array of 4 objects.
        `;

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A catchy title for the date idea." },
                    location: { type: Type.STRING, description: "The specific name of the venue or place." },
                    description: { type: Type.STRING, description: "A tempting description of the activity." },
                    reasoning: { type: Type.STRING, description: "Why this is a good fit based on the profile or time." }
                },
                required: ['title', 'location', 'description', 'reasoning']
            }
        };

        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });

<<<<<<< HEAD
        const jsonStr = response.text.trim();
=======
        const jsonStr = response.text?.trim() ?? "";
>>>>>>> 7a3b66c (Update README with correct repo info)
        return JSON.parse(jsonStr) as DateOption[];
    } catch (error) {
        console.error("Error generating structured date ideas:", error);
        throw new Error("Failed to generate date options.");
    }
}

<<<<<<< HEAD
export const generateGiftIdeas = async (profile: PersonProfile, userZip?: string): Promise<string> => {
=======
export const generateGiftIdeas = async (profile: PersonProfile, userZip?: string): Promise<GiftIdea[]> => {
>>>>>>> 7a3b66c (Update README with correct repo info)
    try {
        const gemini = getAiClient();
        const locationContext = userZip ? `The user is located in or near zip code ${userZip}. If suggesting experiences or local shops, consider this location.` : '';

        const prompt = `
<<<<<<< HEAD
        You are a thoughtful gift-giving assistant. Based on the provided profile, brainstorm 3-5 unique and personalized gift ideas. For each idea, explain why it would be a great gift for this person.
        ${locationContext}

        Also, for one of the ideas that could be a custom-printed item (like a mug, t-shirt, or poster), provide a detailed, descriptive prompt that could be used with an AI image generator to create a cool design.
=======
        You are a thoughtful and creative gift-giving assistant. Based on the provided profile, brainstorm 4 unique and personalized gift ideas.
        
        Instructions:
        - Provide a mix of gift types (e.g., an experience, a physical item, a custom item).
        - For physical items or bookable experiences, USE YOUR SEARCH TOOL to find a relevant purchase link from a major online retailer (like Amazon, Etsy, etc.) and include it in the 'purchaseUrl' field. Only provide a URL if it is a direct link to a product page. Do not provide a link for abstract gifts.
        - For ONE of the ideas that would be good for a custom-printed item, provide a detailed prompt for an AI image generator in the 'imagePrompt' field.
        - Respond ONLY with a valid JSON array of objects. Do not include any other text, markdown, or explanations.
        - The JSON schema for each object should be: { "title": string, "category": string, "description": string, "reasoning": string, "purchaseUrl"?: string, "imagePrompt"?: string }

        ${locationContext}
>>>>>>> 7a3b66c (Update README with correct repo info)
        
        **Profile:**
        - **Name:** ${profile.name}
        - **Likes:** ${profile.likes}
        - **Dislikes:** ${profile.dislikes}
        - **Hobbies:** ${profile.hobbies}

<<<<<<< HEAD
        Format your response in Markdown. The image prompt should be clearly labeled and enclosed in a code block.
        `;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
=======
        Return a JSON array of 4 objects.
        `;
        
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });

        // Clean the response to get only the JSON part
        let jsonStr = response.text?.trim() ?? "";
        const startIndex = jsonStr.indexOf('[');
        const endIndex = jsonStr.lastIndexOf(']');
        if (startIndex === -1 || endIndex === -1) {
            console.error("Malformed JSON response from AI:", jsonStr);
            throw new Error("Invalid JSON response from AI.");
        }
        jsonStr = jsonStr.substring(startIndex, endIndex + 1);

        return JSON.parse(jsonStr) as GiftIdea[];
>>>>>>> 7a3b66c (Update README with correct repo info)
    } catch (error) {
        console.error("Error generating gift ideas:", error);
        throw new Error("Failed to generate gift ideas.");
    }
};

export const generateGiftImage = async (prompt: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

<<<<<<< HEAD
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image was generated.");

    } catch (error) {
        console.error("Error generating gift image:", error);
        throw new Error("Failed to generate image.");
    }
};

export const getDatingAdvice = async (dateType: string, question: string): Promise<DatingAdviceResponse> => {
    try {
        const gemini = getAiClient();
        const prompt = `
        You are Wing Man, an AI dating coach. Provide advice for a "${dateType}" date.
=======
        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data ?? "";
                    return `data:image/png;base64,${base64ImageBytes}`;
                }
            }
        }
        throw new Error("No image was generated.");
    }
    catch (error) {
        console.error("Error generating gift image:", error);
        throw new Error("Failed to generate image.");
    }
        const prompt = `
        You are BRUH, an AI dating coach. Provide advice for a "${dateType}" date.
>>>>>>> 7a3b66c (Update README with correct repo info)
        The user has a specific question: "${question}".
        
        Please provide a comprehensive response in the requested JSON format. The vibe should be confident, friendly, and supportive.
        
        Important:
        - Keep the 'questionAnswer' concise and easy to read.
        - Use Markdown formatting (bolding key terms, using bullet points) inside the 'questionAnswer' string to break up long text.
        - Avoid huge walls of text.
        `;

        const schema = {
            type: Type.OBJECT,
            properties: {
                keyVibe: { type: Type.STRING, description: "A short, catchy phrase for the date's overall vibe." },
                dos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key things to do." },
                donts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key things to avoid." },
                outfitSuggestion: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: "A brief description of a suitable outfit." },
                        reasoning: { type: Type.STRING, description: "Why this outfit works for the occasion." }
                    },
                    required: ['description', 'reasoning']
                },
                conversationStarters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 interesting questions or topics to bring up." },
                icebreakerJoke: { type: Type.STRING, description: "A light-hearted, clean joke to break the ice." },
                questionAnswer: { type: Type.STRING, description: "A direct, concise, and formatted answer to the user's specific question." }
            },
            required: ['keyVibe', 'dos', 'donts', 'outfitSuggestion', 'conversationStarters', 'questionAnswer']
        };

        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });

<<<<<<< HEAD
        const jsonStr = response.text.trim();
=======
        const jsonStr = response.text?.trim() ?? "";
>>>>>>> 7a3b66c (Update README with correct repo info)
        return JSON.parse(jsonStr) as DatingAdviceResponse;
    } catch (error) {
        console.error("Error getting dating advice:", error);
        throw new Error("Failed to get dating advice. The AI might be having a moment.");
    }
};

export const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text, with no extra explanations or formatting.\n\nText: "${text}"`;
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
<<<<<<< HEAD
        return response.text.trim();
=======
        return response.text?.trim() ?? "";
>>>>>>> 7a3b66c (Update README with correct repo info)
    } catch (error) {
        console.error("Error translating text:", error);
        throw new Error("Failed to translate text.");
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const gemini = getAiClient();
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech.");
    }
<<<<<<< HEAD
};
=======
}
>>>>>>> 7a3b66c (Update README with correct repo info)
