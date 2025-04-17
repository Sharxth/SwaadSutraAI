import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
});

// Generate a recipe based on given ingredients and preferences
export async function generateRecipe(
  ingredients: string[],
  preferences: string,
  cuisineType: string,
  additionalInstructions: string
) {
  try {
    const prompt = `
    Create a detailed recipe using the following ingredients: ${ingredients.join(", ")}.

    ${preferences ? `Dietary preferences: ${preferences}.` : ""}
    ${cuisineType && cuisineType !== "Any cuisine" ? `Cuisine type: ${cuisineType}.` : ""}
    ${additionalInstructions ? `Additional instructions: ${additionalInstructions}.` : ""}

    Provide a JSON response with the following structure:
    {
      "title": "Recipe Title",
      "description": "Brief description of the recipe",
      "ingredients": ["Ingredient 1 with quantity", "Ingredient 2 with quantity", ...],
      "instructions": ["Step 1", "Step 2", ...],
      "cookingTime": time in minutes (integer),
      "servings": number of servings (integer),
      "difficulty": "Easy", "Medium", or "Hard",
      "cuisineType": "The cuisine type",
      "imageUrl": ""
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const content = response.choices[0].message?.content;
    if(!content) throw new Error('No content returned from OPENAI')

    const recipeData = JSON.parse(content);
    return {
      ...recipeData,
      recipeType: "ai_generated",
    };
  } catch (error: unknown) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe");
  }
}

export async function enhanceRecipe(
  title: string,
  ingredients: string[],
  instructions: string[],
  enhancementFocus: string[],
  additionalNotes: string
) {
  try {
    const prompt = `
    Enhance the following recipe based on the specified focus areas. Maintain the core dish but improve it based on the enhancement focus.

    Recipe Title: ${title}

    Ingredients:
    ${ingredients.join("\n")}

    Instructions:
    ${instructions.join("\n")}

    Enhancement Focus: ${enhancementFocus.join(", ")}
    ${additionalNotes ? `Additional Notes: ${additionalNotes}` : ""}

    Provide a JSON response with the following structure:
    {
      "title": "Enhanced Recipe Title",
      "description": "Brief description of the enhanced recipe",
      "ingredients": ["Ingredient 1 with quantity", "Ingredient 2 with quantity", ...],
      "instructions": ["Step 1", "Step 2", ...],
      "enhancementSummary": ["Enhancement 1", "Enhancement 2", ...],
      "cookingTime": time in minutes (integer),
      "servings": number of servings (integer),
      "difficulty": "Easy", "Medium", or "Hard",
      "cuisineType": "The cuisine type"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });


    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from OpenAI");

    const enhancedRecipeData = JSON.parse(content);
    return {
      ...enhancedRecipeData,
      recipeType: "enhanced",
    };
  } catch (error: any) {
    console.error("Error generating recipe:", error.response?.data || error.message || error);
    console.error("OpenAI error:", error.response?.data);

  }
  
}
