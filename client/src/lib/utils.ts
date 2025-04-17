import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getRandomFoodImageUrl(): string {
  // Collection of food-related Unsplash IDs for randomization
  const unsplashIds = [
    'Yn0UX4tMcC0', // colorful dish
    'IGfIGP5ONV0', // pasta
    '33GPuoFI7v8', // Indian food
    'EzH46XCDQRY', // pizza
    '_0JpjeY9SZ4', // steak
    'eeqbbemH9-c', // soup
    'SJ7uORconic', // salad
    'auIbTAcSH6E', // seafood
    'MqT0asuoIcU', // burger
    '5LIInaqRp5s', // mexican food
    'XPXQmUQ8Kuo', // dessert
    'wMdjSYzPSS4', // sandwich
    'kcA-c3f_3FE', // breakfast
    'D-vDQMTfAAU', // vegetables
    'SU1LFoeEUkk', // fruits
  ];
  
  const randomId = unsplashIds[Math.floor(Math.random() * unsplashIds.length)];
  return `https://images.unsplash.com/photo-${randomId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
