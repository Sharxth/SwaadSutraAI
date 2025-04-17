import { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getRandomFoodImageUrl } from '@/lib/utils';
import { Recipe } from '@shared/schema';
import { useRecipes } from '@/context/RecipeContext';
import { Loader2, Wand2, Save, Printer } from 'lucide-react';
import { useLocation } from 'wouter';

interface EnhancementOption {
  id: string;
  label: string;
  value: string;
}

const enhancementOptions: EnhancementOption[] = [
  { id: 'flavor', label: 'Flavor Enhancement', value: 'flavor' },
  { id: 'health', label: 'Healthier Version', value: 'health' },
  { id: 'texture', label: 'Texture Improvement', value: 'texture' },
  { id: 'presentation', label: 'Presentation', value: 'presentation' },
  { id: 'simplify', label: 'Simplify Process', value: 'simplify' },
  { id: 'alternative', label: 'Ingredient Alternatives', value: 'alternative' },
];

export default function RecipeEnhancer() {
  const [recipeSource, setRecipeSource] = useState('vault');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualIngredients, setManualIngredients] = useState('');
  const [manualInstructions, setManualInstructions] = useState('');
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [enhancedRecipe, setEnhancedRecipe] = useState<Recipe | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const { recipes, loading } = useRecipes();
  const { toast } = useToast();
  const [location] = useLocation();

  // Get state from location if it exists
  useEffect(() => {
    const locationState = location.state as { recipeId?: number } | undefined;
    if (locationState?.recipeId) {
      setRecipeSource('vault');
      setSelectedRecipeId(String(locationState.recipeId));
    }
  }, [location]);

  const handleEnhancementToggle = (value: string) => {
    setSelectedEnhancements(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const validateForm = () => {
    if (recipeSource === 'vault' && !selectedRecipeId) {
      toast({
        title: "Missing selection",
        description: "Please select a recipe from your vault to enhance.",
        variant: "destructive",
      });
      return false;
    }
    
    if (recipeSource === 'manual') {
      if (!manualTitle) {
        toast({
          title: "Missing recipe title",
          description: "Please provide a title for your recipe.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!manualIngredients) {
        toast({
          title: "Missing ingredients",
          description: "Please provide ingredients for your recipe.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!manualInstructions) {
        toast({
          title: "Missing instructions",
          description: "Please provide cooking instructions for your recipe.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (selectedEnhancements.length === 0) {
      toast({
        title: "No enhancements selected",
        description: "Please select at least one enhancement focus.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleEnhanceRecipe = async () => {
    if (!validateForm()) return;
    
    setIsEnhancing(true);
    try {
      const requestData = recipeSource === 'vault'
        ? { recipeId: parseInt(selectedRecipeId), enhancementFocus: selectedEnhancements, additionalNotes }
        : {
            title: manualTitle,
            ingredients: manualIngredients.split('\n').filter(line => line.trim()),
            instructions: manualInstructions.split('\n').filter(line => line.trim()),
            enhancementFocus: selectedEnhancements,
            additionalNotes,
          };
      
      const response = await apiRequest('POST', '/api/recipes/enhance', requestData);
      const recipe = await response.json();
      
      // Add a random food image URL if one isn't provided
      if (!recipe.imageUrl) {
        recipe.imageUrl = getRandomFoodImageUrl();
      }
      
      setEnhancedRecipe(recipe);
      
      toast({
        title: "Recipe enhanced",
        description: "Your recipe has been enhanced successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Enhancement failed",
        description: error.message || "Failed to enhance recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!enhancedRecipe) return;
    
    try {
      toast({
        title: "Recipe saved",
        description: "Your enhanced recipe has been saved to your vault.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <Heading 
          title="Recipe Enhancer" 
          description="Elevate your recipes with AI-powered enhancements."
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side: Recipe Input */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-5 font-poppins">Enter Your Recipe</h3>
            
            <div className="mb-6">
              <Label className="block text-neutral-900 mb-2">Recipe Source</Label>
              <RadioGroup value={recipeSource} onValueChange={setRecipeSource} className="flex space-x-4">
                <div className="flex items-center">
                  <RadioGroupItem value="vault" id="source-vault" />
                  <Label htmlFor="source-vault" className="ml-2 cursor-pointer">From Recipe Vault</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="manual" id="source-manual" />
                  <Label htmlFor="source-manual" className="ml-2 cursor-pointer">Manual Entry</Label>
                </div>
              </RadioGroup>
            </div>

            {/* From Vault Option */}
            {recipeSource === 'vault' && (
              <div className="mb-6">
                <Label className="block text-neutral-900 mb-2">Select Recipe</Label>
                <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : recipes.length === 0 ? (
                      <div className="p-2 text-center text-neutral-600">No recipes found</div>
                    ) : (
                      recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={String(recipe.id)}>
                          {recipe.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Manual Entry Option */}
            {recipeSource === 'manual' && (
              <div>
                <div className="mb-5">
                  <Label className="block text-neutral-900 mb-2">Recipe Title</Label>
                  <Input 
                    type="text" 
                    placeholder="Enter recipe name"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                  />
                </div>
                
                <div className="mb-5">
                  <Label className="block text-neutral-900 mb-2">Ingredients</Label>
                  <Textarea 
                    rows={5} 
                    placeholder="Enter ingredients line by line"
                    value={manualIngredients}
                    onChange={(e) => setManualIngredients(e.target.value)}
                  />
                </div>

                <div className="mb-5">
                  <Label className="block text-neutral-900 mb-2">Instructions</Label>
                  <Textarea 
                    rows={8} 
                    placeholder="Enter recipe instructions"
                    value={manualInstructions}
                    onChange={(e) => setManualInstructions(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mb-5">
              <Label className="block text-neutral-900 mb-2">Enhancement Focus (Select up to 3)</Label>
              <div className="grid grid-cols-2 gap-2">
                {enhancementOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <Checkbox 
                      id={`focus-${option.id}`} 
                      checked={selectedEnhancements.includes(option.value)}
                      onCheckedChange={() => handleEnhancementToggle(option.value)}
                      disabled={selectedEnhancements.length >= 3 && !selectedEnhancements.includes(option.value)}
                    />
                    <Label htmlFor={`focus-${option.id}`} className="ml-2 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <Label className="block text-neutral-900 mb-2">Additional Notes (Optional)</Label>
              <Textarea 
                rows={3} 
                placeholder="Any specific concerns or requests"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>

            <div className="text-center">
              <Button 
                className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 font-poppins"
                onClick={handleEnhanceRecipe}
                disabled={isEnhancing}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enhancing...
                  </>
                ) : (
                  <>
                    Enhance Recipe <Wand2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Side: Enhanced Recipe */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold font-poppins">Enhanced Recipe</h3>
              {enhancedRecipe && (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSaveRecipe} 
                    title="Save Enhanced Recipe"
                  >
                    <Save className="h-5 w-5 text-primary" />
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
              )}
            </div>

            {!enhancedRecipe ? (
              // Placeholder State
              <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-300 rounded-lg">
                <Wand2 className="h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-neutral-600 text-center">
                  Your enhanced recipe will appear here.<br />Use the form on the left to get started.
                </p>
              </div>
            ) : (
              // Results State
              <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <h3 className="text-2xl font-semibold mb-4 font-poppins">{enhancedRecipe.title}</h3>
                
                {enhancedRecipe.additionalData?.enhancementSummary && (
                  <div className="mb-5">
                    <h4 className="text-lg font-semibold mb-2 font-poppins">Enhancements Summary:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {enhancedRecipe.additionalData.enhancementSummary.map((enhancement: string, index: number) => (
                        <li key={index} className="text-primary">{enhancement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-5">
                  <h4 className="text-lg font-semibold mb-2 font-poppins">Enhanced Ingredients:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {enhancedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2 font-poppins">Enhanced Instructions:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {enhancedRecipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
