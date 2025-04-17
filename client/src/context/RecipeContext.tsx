import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@shared/schema';

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  refreshRecipes: () => Promise<void>;
  addRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: number) => Promise<boolean>;
  getCurrentFilters: () => { searchQuery: string; recipeType: string };
  setSearchQuery: (query: string) => void;
  setRecipeType: (type: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Simple in-memory storage
let recipeIdCounter = 1;
const initialRecipes: Recipe[] = [];

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeType, setRecipeType] = useState('all');
  const { toast } = useToast();

  // Simplified function that doesn't make API calls
  const refreshRecipes = async () => {
    setLoading(true);
    try {
      // Filter recipes based on search query and type
      let filteredRecipes = [...recipes];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredRecipes = filteredRecipes.filter(
          recipe => recipe.title.toLowerCase().includes(query) || 
                   recipe.description?.toLowerCase().includes(query)
        );
      }
      
      if (recipeType !== 'all') {
        filteredRecipes = filteredRecipes.filter(
          recipe => recipe.recipeType === recipeType
        );
      }
      
      // Using setTimeout to simulate an API call
      setTimeout(() => {
        setRecipes(filteredRecipes);
        setLoading(false);
      }, 300);
    } catch (err: any) {
      setError('Error filtering recipes');
      setLoading(false);
    }
  };

  // Add a new recipe to the local collection
  const addRecipe = async (recipe: Recipe) => {
    // Assign an ID if one doesn't exist
    if (!recipe.id) {
      recipe.id = recipeIdCounter++;
    }
    
    setRecipes(prev => [...prev, recipe]);
    
    toast({
      title: 'Success',
      description: 'Recipe saved successfully',
    });
  };

  // Delete a recipe from the local collection
  const deleteRecipe = async (id: number): Promise<boolean> => {
    try {
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
      toast({
        title: 'Success',
        description: 'Recipe deleted successfully',
      });
      return true;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete recipe',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getCurrentFilters = () => {
    return {
      searchQuery,
      recipeType,
    };
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        refreshRecipes,
        addRecipe,
        deleteRecipe,
        getCurrentFilters,
        setSearchQuery,
        setRecipeType,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
