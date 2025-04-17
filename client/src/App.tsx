import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RecipeVault from "@/pages/recipe-vault";
import RecipeMaker from "@/pages/recipe-maker";
import RecipeEnhancer from "@/pages/recipe-enhancer";
import { Header } from "@/components/layout/Header";
import { RecipeProvider } from "./context/RecipeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vault" component={RecipeVault} />
      <Route path="/maker" component={RecipeMaker} />
      <Route path="/enhancer" component={RecipeEnhancer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeProvider>
        <div className="bg-neutral-50 min-h-screen">
          <Header />
          <Router />
        </div>
        <Toaster />
      </RecipeProvider>
    </QueryClientProvider>
  );
}

export default App;
