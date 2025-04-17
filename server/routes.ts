import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Using HuggingFace API instead of mock generator
import { generateRecipe, enhanceRecipe } from './openai'; // Assuming enhanceRecipe is also moved to huggingface.ts
import { ingredientsInputSchema, enhanceRecipeSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recipes
  app.get("/api/recipes", async (_req: Request, res: Response) => {
    try {
      const recipes = await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get recipe by ID
  app.get("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(id);

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Search recipes
  app.get("/api/recipes/search/:query", async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const recipes = await storage.searchRecipes(query);
      res.json(recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).json({ message: "Failed to search recipes" });
    }
  });

  // Get recipes by type
  app.get("/api/recipes/type/:type", async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      const recipes = await storage.getRecipesByType(type);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes by type:", error);
      res.status(500).json({ message: "Failed to fetch recipes by type" });
    }
  });

  // Create recipe with AI
  app.post("/api/recipes/generate", async (req: Request, res: Response) => {
    try {
      const validatedInput = ingredientsInputSchema.parse(req.body);

      const { ingredients, preferences, cuisineType, additionalInstructions } = validatedInput;

      const generatedRecipe = await generateRecipe(
        ingredients, 
        preferences || "", 
        cuisineType || "", 
        additionalInstructions || ""
      );

      const savedRecipe = await storage.createRecipe(generatedRecipe);
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);

      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      res.status(500).json({ message: "Failed to generate recipe" });
    }
  });

  // Enhance a recipe with AI
  app.post("/api/recipes/enhance", async (req: Request, res: Response) => {
    try {
      const validatedInput = enhanceRecipeSchema.parse(req.body);

      let title: string;
      let ingredients: string[];
      let instructions: string[];
      let originalRecipeId: number | undefined;

      // If we're enhancing an existing recipe from the vault
      if (validatedInput.recipeId) {
        const existingRecipe = await storage.getRecipeById(validatedInput.recipeId);
        if (!existingRecipe) {
          return res.status(404).json({ message: "Recipe to enhance not found" });
        }

        title = existingRecipe.title;
        ingredients = existingRecipe.ingredients;
        instructions = existingRecipe.instructions;
        originalRecipeId = existingRecipe.id;
      } else {
        // For manual entry
        if (!validatedInput.title || !validatedInput.ingredients || !validatedInput.instructions) {
          return res.status(400).json({ message: "Missing required recipe details" });
        } 

        title = validatedInput.title;
        ingredients = validatedInput.ingredients;
        instructions = validatedInput.instructions;
      }

      const enhancedRecipe = await enhanceRecipe(
        title,
        ingredients,
        instructions,
        validatedInput.enhancementFocus || [],
        validatedInput.additionalNotes || ""
      );

      // Add reference to original recipe if applicable
      if (originalRecipeId) {
        enhancedRecipe.originalRecipeId = originalRecipeId;
      }

      const savedRecipe = await storage.createRecipe(enhancedRecipe);
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error enhancing recipe:", error);

      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      res.status(500).json({ message: "Failed to enhance recipe" });
    }
  });

  // Save a manually created recipe
  app.post("/api/recipes", async (req: Request, res: Response) => {
    try {
      const recipe = req.body;
      recipe.recipeType = "manual";

      const savedRecipe = await storage.createRecipe(recipe);
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      res.status(500).json({ message: "Failed to save recipe" });
    }
  });

  // Delete a recipe
  app.delete("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRecipe(id);

      if (!success) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}