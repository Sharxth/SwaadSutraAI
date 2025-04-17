import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { useRecipes } from '@/context/RecipeContext';
import { RecipeCard } from '@/components/ui/recipe-card';
import { RecipeViewModal } from '@/components/modals/RecipeViewModal';
import { Recipe } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2, Search, Plus } from 'lucide-react';
import { useLocation } from 'wouter';

export default function RecipeVault() {
  const { recipes, loading, error, setSearchQuery, setRecipeType, getCurrentFilters } = useRecipes();
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const { searchQuery, recipeType } = getCurrentFilters();
  const [_, navigate] = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (value: string) => {
    setRecipeType(value);
    setPage(1);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setViewRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeRecipeModal = () => {
    setIsModalOpen(false);
    setViewRecipe(null);
  };
  
  const navigateToRecipeMaker = () => {
    navigate('/maker');
  };

  // Pagination logic
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedRecipes = recipes.slice(startIndex, startIndex + itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
              if (i === 4) return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
              if (i === 0) return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              if (i === 0) return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
              if (i === 4) return (
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
              pageNum = page - 1 + (i - 1); 
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  isActive={page === pageNum}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <Heading 
          title="Recipe Vault" 
          description="Your personal collection of created and enhanced recipes."
        />

        <div className="flex flex-col md:flex-row mb-6 items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search recipes..."
                className="pl-10 pr-4 py-2 w-full md:w-80"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Button 
              onClick={navigateToRecipeMaker} 
              className="bg-primary hover:bg-primary-dark text-white w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Recipe
            </Button>
          </div>

          <div>
            <Select value={recipeType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Recipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recipes</SelectItem>
                <SelectItem value="ai_generated">AI Generated</SelectItem>
                <SelectItem value="enhanced">Enhanced Recipes</SelectItem>
                <SelectItem value="manual">Manual Entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
            <p>{error}</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center p-12 bg-neutral-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 font-poppins">No recipes found</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery 
                ? `No recipes match your search for "${searchQuery}"`
                : recipeType !== 'all'
                  ? `You don't have any ${recipeType.replace('_', ' ')} recipes yet`
                  : "Your recipe vault is empty. Create your first recipe!"}
            </p>
            {!searchQuery && recipeType === 'all' && (
              <Button 
                onClick={navigateToRecipeMaker} 
                className="bg-primary hover:bg-primary-dark text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Recipe
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onView={openRecipeModal}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        )}

        <RecipeViewModal 
          recipe={viewRecipe} 
          isOpen={isModalOpen} 
          onClose={closeRecipeModal} 
        />
      </div>
    </div>
  );
}
