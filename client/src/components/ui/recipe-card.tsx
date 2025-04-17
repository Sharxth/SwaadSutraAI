import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Recipe } from '@shared/schema';
import { formatDate, truncateText } from '@/lib/utils';
import { Eye, Edit, Trash2, Heart } from 'lucide-react';
import { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { useToast } from '@/hooks/use-toast';

type RecipeCardProps = {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEnhance?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onView, onEnhance }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { deleteRecipe } = useRecipes();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this recipe?")) {
      const success = await deleteRecipe(recipe.id);
      if (success) {
        toast({
          title: "Recipe deleted",
          description: `"${recipe.title}" has been removed from your recipe vault.`,
        });
      }
    }
  };

  const handleEnhance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnhance) {
      onEnhance(recipe);
    } else {
      navigate('/enhancer', { state: { recipeId: recipe.id } });
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `"${recipe.title}" has been removed from your favorites.` 
        : `"${recipe.title}" has been added to your favorites.`,
    });
  };

  const getRecipeTypeTag = () => {
    switch (recipe.recipeType) {
      case 'ai_generated':
        return { label: 'AI Generated', className: 'bg-purple-100 text-purple-700' };
      case 'enhanced':
        return { label: 'Enhanced', className: 'bg-green-100 text-green-700' };
      case 'manual':
        return { label: 'Manual', className: 'bg-blue-100 text-blue-700' };
      default:
        return { label: 'Recipe', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const typeTag = getRecipeTypeTag();

  return (
    <Card 
      className={`recipe-card overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(recipe)}
    >
      <div className="relative h-48">
        <img 
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80'} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md cursor-pointer" onClick={handleFavoriteToggle}>
          {isFavorite 
            ? <Heart className="h-5 w-5 text-red-500 fill-current" /> 
            : <Heart className="h-5 w-5 text-red-500" />}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold font-poppins">{recipe.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500 flex items-center gap-1">
              <span className="inline-block w-4 h-4">⏱️</span> {recipe.cookingTime || '--'} mins
            </span>
            <span className={`rounded-full px-3 py-1 text-xs ${typeTag.className}`}>
              {typeTag.label}
            </span>
          </div>
        </div>
        <p className="text-neutral-600 line-clamp-2 mb-4">
          {recipe.description ? truncateText(recipe.description, 100) : 'No description available'}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500 flex items-center gap-1">
            <span className="inline-block w-4 h-4">🍽️</span> {recipe.servings || '--'} servings
          </span>
          <div className="flex space-x-2">
            <button 
              className="text-primary hover:text-primary-dark" 
              title="View Recipe"
              onClick={(e) => {
                e.stopPropagation();
                onView(recipe);
              }}
            >
              <Eye className="h-5 w-5" />
            </button>
            <button 
              className="text-secondary hover:text-secondary-dark" 
              title="Edit Recipe"
              onClick={handleEnhance}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              className="text-red-500 hover:text-red-700" 
              title="Delete Recipe"
              onClick={handleDelete}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}