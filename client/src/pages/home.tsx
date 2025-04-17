import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Database, 
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const [_, navigate] = useLocation();

  const scrollToMaker = () => {
    navigate('/maker');
  };

  const scrollToVault = () => {
    navigate('/vault');
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-16">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair text-neutral-900 leading-tight">
                Craft Perfect Recipes <span className="text-primary">With AI</span>
              </h2>
              <p className="text-lg mb-8 text-neutral-600">
                SwaadSutra transforms your ingredients into delicious recipes and enhances your cooking with AI-powered suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-6 rounded-lg font-medium transition-colors duration-300 font-poppins"
                  onClick={scrollToMaker}
                >
                  Create Recipe
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary-light hover:text-white px-6 py-6 rounded-lg font-medium transition-colors duration-300 font-poppins"
                  onClick={scrollToVault}
                >
                  Explore Recipes
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
                alt="Delicious Food" 
                className="w-full h-full object-cover" 
                style={{ minHeight: '300px', maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <h3 className="text-3xl font-bold mb-10 font-playfair text-center">What SwaadSutra Offers</h3>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1598522325074-042db73aa4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="AI Recipe Creation" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mb-5 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">AI Recipe Creation</h4>
              <p className="text-neutral-600">Turn your available ingredients into complete recipes with our AI-powered recipe generator.</p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1607877361964-d8a3513710e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Recipe Enhancement" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mb-5 text-white">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">Recipe Enhancement</h4>
              <p className="text-neutral-600">Elevate your existing recipes with AI suggestions for improved flavors and techniques.</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Recipe Vault" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-5 text-white">
                <Database className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">Recipe Vault</h4>
              <p className="text-neutral-600">Organize and store all your recipes in one place with easy access and management.</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <h3 className="text-3xl font-bold mb-10 font-playfair text-center">How It Works</h3>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-light -translate-y-1/2 z-0"></div>
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center overflow-hidden">
              <div className="mb-5 relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">1</div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-light rounded-full opacity-20"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">Enter Ingredients</h4>
              <p className="text-neutral-600">Input the ingredients you have available in your kitchen.</p>
              <div className="mt-4 bg-neutral-50 p-3 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">Tomato</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">Onion</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200">Chicken</span>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center overflow-hidden">
              <div className="mb-5 relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">2</div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-light rounded-full opacity-20"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">Generate Recipe</h4>
              <p className="text-neutral-600">Our AI analyzes your ingredients and creates a customized recipe.</p>
              <div className="mt-4 text-left">
                <div className="h-2 bg-primary-light rounded-full w-3/4 mx-auto mb-2"></div>
                <div className="h-2 bg-primary-light rounded-full w-1/2 mx-auto mb-2"></div>
                <div className="h-2 bg-primary-light rounded-full w-2/3 mx-auto"></div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md text-center overflow-hidden">
              <div className="mb-5 relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">3</div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-light rounded-full opacity-20"></div>
              </div>
              <h4 className="text-xl font-semibold mb-3 font-poppins">Save & Enhance</h4>
              <p className="text-neutral-600">Save your recipe to the vault and enhance it further if desired.</p>
              <div className="mt-4 flex justify-center gap-3">
                <div className="h-8 w-8 bg-primary text-white flex items-center justify-center rounded-full">✓</div>
                <div className="h-8 w-8 bg-secondary text-white flex items-center justify-center rounded-full">✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
