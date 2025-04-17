import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Share2, X, Sparkles } from 'lucide-react';
import { Recipe } from '@shared/schema';
import { useLocation } from 'wouter';

// No special type needed for this simplified version

interface RecipeViewModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeViewModal({ recipe, isOpen, onClose }: RecipeViewModalProps) {
  const [_, navigate] = useLocation();

  if (!recipe) return null;

  const handleEnhance = () => {
    onClose();
    navigate('/enhancer', { state: { recipeId: recipe.id } });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.log('Error sharing', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Sharing not supported on this browser');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b border-gray-200 sticky top-0 bg-white flex justify-between">
          <DialogTitle className="text-2xl font-semibold font-poppins">{recipe.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6">
          <div className="mb-6">
            <img 
              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'} 
              alt={recipe.title} 
              className="w-full rounded-lg object-cover" 
              style={{ maxHeight: '400px' }} 
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6 text-center">
            <div>
              <p className="text-sm text-neutral-500">Cooking Time</p>
              <p className="font-semibold">{recipe.cookingTime || '--'} mins</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Servings</p>
              <p className="font-semibold">{recipe.servings || '--'} people</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Difficulty</p>
              <p className="font-semibold">{recipe.difficulty || '--'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Type</p>
              <p className="font-semibold">{recipe.cuisineType || '--'}</p>
            </div>
          </div>

          {recipe.recipeType === 'enhanced' && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 font-poppins">Enhanced Recipe</h4>
              <p className="text-primary font-medium">This recipe has been enhanced to improve flavor, texture, or preparation techniques.</p>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 font-poppins">Ingredients:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 font-poppins">Instructions:</h4>
            <ol className="list-decimal pl-5 space-y-3">
              {recipe.instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
          </div>
          
          {recipe.description && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold mb-3 font-poppins">Notes:</h4>
              <p>{recipe.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="p-6 border-t border-gray-200">
          <div className="flex justify-between w-full">
            <Button onClick={handleEnhance} className="bg-primary hover:bg-primary-dark text-white">
              <Sparkles className="mr-2 h-4 w-4" /> Enhance Recipe
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
