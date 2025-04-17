import { recipes, type Recipe, type InsertRecipe } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
  
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getOriginalAndEnhancedRecipes(originalId: number): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
  searchRecipes(query: string): Promise<Recipe[]>;
  getRecipesByType(type: string): Promise<Recipe[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private recipesMap: Map<number, Recipe>;
  userCurrentId: number;
  recipeCurrentId: number;

  constructor() {
    this.users = new Map();
    this.recipesMap = new Map();
    this.userCurrentId = 1;
    this.recipeCurrentId = 1;
  }

  async getUser(id: number): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: any): Promise<any> {
    const id = this.userCurrentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipesMap.values());
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipesMap.get(id);
  }

  async getOriginalAndEnhancedRecipes(originalId: number): Promise<Recipe[]> {
    const recipes = Array.from(this.recipesMap.values());
    return recipes.filter(recipe => 
      recipe.id === originalId || recipe.originalRecipeId === originalId
    );
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeCurrentId++;
    const newRecipe: Recipe = {
      ...recipe,
      id,
      createdAt: new Date(),
      description: recipe.description ?? null,
      cookingTime: recipe.cookingTime ?? null,
      servings: recipe.servings ?? null,
      difficulty: recipe.difficulty ?? null,
      cuisineType: recipe.cuisineType ?? null,
      imageUrl: recipe.imageUrl ?? null,
      originalRecipeId: recipe.originalRecipeId ?? null,
      additionalData: recipe.additionalData ?? null,
    };
    this.recipesMap.set(id, newRecipe);
    return newRecipe;
  }
  

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipesMap.delete(id);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    if (!query) return this.getAllRecipes();
    
    const lowerQuery = query.toLowerCase();
    const recipes = Array.from(this.recipesMap.values());
    
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowerQuery) 
      ) ||
      recipe.description?.toLowerCase().includes(lowerQuery)
    );
  }

  async getRecipesByType(type: string): Promise<Recipe[]> {
    if (type === "all") return this.getAllRecipes();
    
    const recipes = Array.from(this.recipesMap.values());
    return recipes.filter(recipe => recipe.recipeType === type);
  }
}

export const storage = new MemStorage();
