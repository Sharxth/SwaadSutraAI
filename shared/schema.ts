import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  cookingTime: integer("cooking_time"),
  servings: integer("servings"),
  difficulty: text("difficulty"),
  cuisineType: text("cuisine_type"),
  imageUrl: text("image_url"),
  recipeType: text("recipe_type").notNull(), // "ai_generated", "enhanced", "manual"
  originalRecipeId: integer("original_recipe_id"), // For enhanced recipes, points to original
  createdAt: timestamp("created_at").defaultNow().notNull(),
  additionalData: json("additional_data"), // For any extra recipe data
});

export const insertRecipeSchema = createInsertSchema(recipes)
  .omit({ id: true, createdAt: true })
  .extend({
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  });

export const ingredientsInputSchema = z.object({
  ingredients: z.array(z.string()).min(1, "Please add at least one ingredient"),
  preferences: z.string().optional(),
  cuisineType: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export const enhanceRecipeSchema = z.object({
  recipeId: z.number().optional(),
  title: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
  enhancementFocus: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export type IngredientsInput = z.infer<typeof ingredientsInputSchema>;
export type EnhanceRecipeInput = z.infer<typeof enhanceRecipeSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
