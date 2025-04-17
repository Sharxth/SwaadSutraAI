import { useState, useRef, KeyboardEvent } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Wand2, Loader2, Save, Printer, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getRandomFoodImageUrl } from '@/lib/utils';
import { Recipe } from '@shared/schema';
import { useRecipes } from '@/context/RecipeContext';
import { useLocation } from 'wouter';

export default function RecipeMaker() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [preferences, setPreferences] = useState('none');
  const [cuisineType, setCuisineType] = useState('any');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const ingredientInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { refreshRecipes, addRecipe } = useRecipes();
  const [_, navigate] = useLocation();

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
      
      if (ingredientInputRef.current) {
        ingredientInputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add at least one ingredient to generate a recipe.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/recipes/generate', {
        ingredients,
        preferences,
        cuisineType,
        additionalInstructions,
      });
      
      const recipe = await response.json();
      
      // Add a random food image URL if one isn't provided
      if (!recipe.imageUrl) {
        recipe.imageUrl = getRandomFoodImageUrl();
      }
      
      setGeneratedRecipe(recipe);
      
      toast({
        title: "Recipe generated",
        description: "Your recipe has been created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    
    try {
      await addRecipe(generatedRecipe);
      toast({
        title: "Recipe saved",
        description: "Your recipe has been saved to your vault.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnhanceRecipe = () => {
    if (!generatedRecipe) return;
    navigate('/enhancer', { state: { recipeId: generatedRecipe.id } });
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <Heading 
          title="Recipe Maker" 
          description="Create custom recipes with your available ingredients."
        />

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
          <h3 className="text-xl font-semibold mb-5 font-poppins">Enter Your Ingredients</h3>
          <div className="mb-5">
            <Label className="block text-neutral-900 mb-2">Ingredients</Label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg mb-2 bg-neutral-50">
              {ingredients.map((ingredient, index) => (
                <span 
                  key={index} 
                  className="bg-white px-3 py-1 rounded-full text-sm flex items-center border border-gray-200"
                >
                  {ingredient}
                  <button 
                    className="ml-2 text-neutral-600 hover:text-red-500"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Input
                type="text"
                placeholder="Type an ingredient..."
                className="border-0 focus-visible:ring-0 flex-grow min-w-[200px] bg-transparent"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={ingredientInputRef}
              />
            </div>
            <p className="text-sm text-neutral-600">Press Enter to add each ingredient</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="block text-neutral-900 mb-2">Preferences</Label>
              <Select value={preferences} onValueChange={setPreferences}>
                <SelectTrigger>
                  <SelectValue placeholder="No preferences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No preferences</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Gluten-free">Gluten-free</SelectItem>
                  <SelectItem value="Low-carb">Low-carb</SelectItem>
                  <SelectItem value="Dairy-free">Dairy-free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-neutral-900 mb-2">Cuisine Type</Label>
              <Select value={cuisineType} onValueChange={setCuisineType}>
                <SelectTrigger>
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any cuisine</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="Thai">Thai</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <Label className="block text-neutral-900 mb-2">Additional Instructions (Optional)</Label>
            <Textarea 
              rows={3} 
              className="w-full" 
              placeholder="E.g., Quick meal, spicy, cooking for two..."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
            />
          </div>

          <div className="text-center">
            <Button 
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 font-poppins"
              onClick={handleGenerateRecipe}
              disabled={isGenerating || ingredients.length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  Generate Recipe <Wand2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recipe Result */}
        {generatedRecipe && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold font-poppins">{generatedRecipe.title}</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSaveRecipe} 
                    title="Save Recipe"
                  >
                    <Save className="h-5 w-5 text-primary" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleEnhanceRecipe} 
                    title="Enhance Recipe"
                  >
                    <Sparkles className="h-5 w-5 text-secondary" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.print()} 
                    title="Print Recipe"
                  >
                    <Printer className="h-5 w-5 text-neutral-600" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={generatedRecipe.imageUrl || getRandomFoodImageUrl()} 
                  alt={generatedRecipe.title} 
                  className="w-full h-full object-cover" 
                  style={{ maxHeight: '400px' }} 
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Cooking Time</p>
                    <p className="font-semibold">{generatedRecipe.cookingTime || '--'} mins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Servings</p>
                    <p className="font-semibold">{generatedRecipe.servings || '--'} people</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-600">Difficulty</p>
                    <p className="font-semibold">{generatedRecipe.difficulty || '--'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 font-poppins">Ingredients:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 font-poppins">Instructions:</h4>
                  <ol className="list-decimal pl-5 space-y-3">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
