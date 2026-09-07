// Frontend-safe menu data (mirrors server/data/menuData.js)
export const categories = [
  { id: 'all', name: 'Full Menu', icon: 'Utensils' },
  { id: 'salads', name: 'Fresh Salads', icon: 'Salad' },
  { id: 'burgers', name: 'Gourmet Burgers', icon: 'Beef' },
  { id: 'sandwiches', name: 'Artisanal Sandwiches', icon: 'Sandwich' },
  { id: 'wraps', name: 'Craft Wraps', icon: 'Wrap' },
  { id: 'drinks', name: 'Craft Drinks', icon: 'Coffee' },
  { id: 'desserts', name: 'House Desserts', icon: 'Cake' },
];

export const menuItems = [
  // SALADS
  {
    id: 'sal-1', name: 'Classic Caesar Salad', category: 'salads', price: 12.99, calories: 420,
    description: 'Crisp romaine lettuce, house-made creamy Caesar dressing, garlic herb croutons, and aged Parmesan shavings.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegetarian'], popular: true,
  },
  {
    id: 'sal-2', name: 'Mediterranean Greek Bowl', category: 'salads', price: 14.49, calories: 380,
    description: 'Fresh cucumbers, vine tomatoes, Kalamata olives, red onion, crumbled feta cheese, and wild oregano lemon vinaigrette.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegetarian', 'Gluten-Free'], popular: true,
  },
  {
    id: 'sal-3', name: 'Avocado Citrus Kale Crunch', category: 'salads', price: 15.99, calories: 460,
    description: 'Tender baby kale, ripe Hass avocado, pink grapefruit segments, toasted almonds, and citrus honey vinaigrette.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegan', 'Gluten-Free'], popular: false,
  },
  // BURGERS
  {
    id: 'brg-1', name: 'Happybreak Prime Angus Burger', category: 'burgers', price: 16.99, calories: 780,
    description: 'Half-pound double-patty certified Angus beef, sharp Wisconsin cheddar, caramelized onions, smoked bacon jam, and brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    dietary: ['Chef Special'], popular: true,
  },
  {
    id: 'brg-2', name: 'Truffle Mushroom Swiss Burger', category: 'burgers', price: 17.49, calories: 740,
    description: 'Grass-fed beef patty topped with sauteed cremini mushrooms, white truffle oil, melted Swiss cheese, and garlic aioli.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    dietary: [], popular: false,
  },
  {
    id: 'brg-3', name: 'Smoky Chipotle Black Bean Burger', category: 'burgers', price: 14.99, calories: 520,
    description: 'House-crafted black bean patty, fresh avocado slice, pickled jalapenos, vegan chipotle crema, and whole grain bun.',
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegan', 'Spicy'], popular: false,
  },
  // SANDWICHES
  {
    id: 'snd-1', name: 'Artisanal Turkey Avocado Club', category: 'sandwiches', price: 13.99, calories: 590,
    description: 'Slow-roasted oven turkey breast, thick-cut hardwood smoked bacon, Hass avocado, ripe tomato, and herb mayo on toasted sourdough.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    dietary: [], popular: true,
  },
  {
    id: 'snd-2', name: 'Tuscan Grilled Chicken Panini', category: 'sandwiches', price: 14.99, calories: 610,
    description: 'Herbed marinate chicken breast, fresh mozzarella, sun-dried tomato pesto, and fresh basil leaves pressed on warm ciabatta.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    dietary: ['Chef Special'], popular: false,
  },
  // WRAPS
  {
    id: 'wrp-1', name: 'Buffalo Chicken Crunch Wrap', category: 'wraps', price: 13.49, calories: 650,
    description: 'Crispy fried chicken tenders tossed in house spicy buffalo sauce, shredded romaine, ranch, and blue cheese crumbles in a spinach tortilla.',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    dietary: ['Spicy'], popular: true,
  },
  {
    id: 'wrp-2', name: 'Roasted Hummus Veggie Wrap', category: 'wraps', price: 12.49, calories: 440,
    description: 'Smooth garlic hummus, grilled zucchini, bell peppers, baby spinach, and crumbled feta cheese wrapped in warm whole wheat flour tortilla.',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegetarian'], popular: false,
  },
  // DRINKS
  {
    id: 'drk-1', name: 'Fresh House Citrus Mint Lemonade', category: 'drinks', price: 4.99, calories: 140,
    description: 'Squeezed Meyer lemons infused with fresh mint leaves and organic agave nectar over crushed ice.',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegan', 'Gluten-Free'], popular: true,
  },
  {
    id: 'drk-2', name: 'Artisanal Cold Brew Iced Coffee', category: 'drinks', price: 5.49, calories: 15,
    description: '18-hour cold steeped single-origin Ethiopian coffee beans served with sweet oat milk foam option.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegan'], popular: true,
  },
  {
    id: 'drk-3', name: 'Sparkling Hibiscus Berry Iced Tea', category: 'drinks', price: 4.49, calories: 80,
    description: 'Brewed wild hibiscus flowers, raspberries, lemon zest, and lightly sparkling mineral water.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegan', 'Gluten-Free'], popular: false,
  },
  // DESSERTS
  {
    id: 'dst-1', name: 'Warm Molten Dark Chocolate Lava Cake', category: 'desserts', price: 8.99, calories: 580,
    description: 'Rich Belgian dark chocolate cake with a molten oozing center, served with Madagascan vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegetarian', 'Chef Special'], popular: true,
  },
  {
    id: 'dst-2', name: 'New York Style Berry Cheesecake', category: 'desserts', price: 8.49, calories: 520,
    description: 'Classic dense and creamy graham cracker crust cheesecake topped with fresh strawberry compote.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    dietary: ['Vegetarian'], popular: false,
  },
];
