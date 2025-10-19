export const RECIPES = {
  "veggie-korma-coconut-cashew": {
    name: "Veggie Korma with Coconut Cashew Sauce",
    category: "Entree",
    description:
      "This creamy vegan vegetable korma is rich, comforting, and full of flavor. Fresh vegetables simmer in a spiced cashew-coconut sauce that tastes restaurant-quality but is surprisingly easy to make at home.",
    components: {
      Paste: [
        { amount: 0.08, unit: "cup", ingredient: "raw cashews", prep: "soaked 4–8 hours, drained, and rinsed" },
        { amount: 0.17, unit: "cup", ingredient: "canned diced tomatoes" },
        { amount: 0.67, unit: "", ingredient: "garlic cloves" },
        { amount: 0.17, unit: "tbsp", ingredient: "fresh ginger", prep: "grated" },
      ],
      Curry: [
        { amount: 0.33, unit: "tbsp", ingredient: "vegetable oil" },
        { amount: 0.17, unit: "medium", ingredient: "onion", prep: "diced" },
        { amount: 0.33, unit: "tsp", ingredient: "garam masala" },
        { amount: 0.17, unit: "tsp", ingredient: "ground cumin" },
        { amount: 0.17, unit: "tsp", ingredient: "whole cumin seeds" },
        { amount: 0.08, unit: "tsp", ingredient: "ground cardamom" },
        { amount: 0.08, unit: "tsp", ingredient: "ground coriander" },
        { amount: 0.08, unit: "tsp", ingredient: "ground turmeric" },
        { amount: 0.17, unit: "14 oz can", ingredient: "full-fat coconut milk" },
        { amount: 0.08, unit: "cup", ingredient: "water" },
        { amount: 0.17, unit: "small", ingredient: "cauliflower head", prep: "broken into florets (about 1½ lb)" },
        { amount: 0.17, unit: "medium", ingredient: "potato", prep: "cut into ½-inch pieces (about 10 oz)" },
        { amount: 0.5, unit: "medium", ingredient: "carrots", prep: "sliced (about 8 oz total)" },
        { amount: 0.17, unit: "tsp", ingredient: "salt", prep: "plus more to taste" },
        { amount: 0.17, unit: "cup", ingredient: "frozen peas", prep: "thawed" },
        { amount: null, unit: "", ingredient: "black pepper", prep: "to taste" },
      ],
      "For Serving": [
        { amount: null, unit: "", ingredient: "cooked basmati rice" },
        { amount: null, unit: "", ingredient: "fresh cilantro", prep: "chopped" },
      ],
    },
    instructions: [
      "Add all paste ingredients to a blender or food processor and blend until smooth. Set aside. Add up to ½ cup of water if needed to blend smoothly, subtracting that amount later from the curry water.",
      "Heat oil in a large pot over medium heat. Add the onion and cook for about 5 minutes, stirring often, until soft and translucent.",
      "Add the garam masala, ground cumin, cumin seeds, cardamom, coriander, and turmeric. Stir constantly for 1 minute to toast the spices.",
      "Stir in the prepared paste and cook for about 2 minutes, until slightly darkened and thickened.",
      "Add coconut milk, water, cauliflower, potato, carrots, and salt. Bring to a boil, stirring occasionally.",
      "Lower the heat and simmer covered for about 15 minutes, stirring every few minutes to prevent scorching, until the potato is fork-tender.",
      "Uncover and continue simmering for about 5 minutes more, until the sauce thickens slightly and vegetables are very tender.",
      "Stir in the peas and cook for 1 more minute to heat through. Season with additional salt and black pepper to taste.",
      "Serve hot over basmati rice, topped with fresh cilantro.",
    ],
    notes:
      "For a spicier version, add a pinch of cayenne pepper with the spices. For richer flavor, increase the garam masala. Nutrition excludes rice.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/vegan-korma-10-e1758853803423.jpg",
    ],
  },
  "artichoke-asparagus-pesto-pasta": {
    name: "Artichoke & Asparagus Pesto Pasta",
    category: "Entree",
    description:
      "Packed with fiber, these springtime veggies help you lose weight. High-antioxidant content makes them cancer-resisting superfoods. Add sautéed shrimp if you’re not vegetarian for a full-fledged gourmet dinner.",
    components: {
      Pasta: [
        { amount: 0.14, unit: "lb", ingredient: "whole wheat penne" },
        { amount: 0.14, unit: "lb", ingredient: "asparagus", prep: "washed, trimmed, and cut into 1 inch pieces" },
      ],
      Vegetables: [
        { amount: 0.13, unit: "lb", ingredient: "artichoke hearts", prep: "quartered" },
        { amount: 0.14, unit: "", ingredient: "red onion", prep: "thinly sliced" },
        { amount: 0.13, unit: "cup", ingredient: "grape tomatoes", prep: "halved" },
      ],
      Sauce: [
        { amount: 0.29, unit: "oz", ingredient: "Christine's Easy Pesto", prep: "or store-bought" },
        { amount: 0.29, unit: "tbsp", ingredient: "extra virgin olive oil" },
        { amount: 0.13, unit: "cup", ingredient: "vegetable broth", prep: "or white wine for deglazing" },
      ],
      Topping: [
        { amount: 0.13, unit: "cup", ingredient: "shredded mozzarella" },
      ],
    },
    instructions: [
      "Blanch the asparagus in boiling water and save the water for cooking the pasta.",
      "Cook the whole wheat penne in the reserved asparagus water according to package directions.",
      "Heat olive oil in a large frying pan over medium-high heat. Sauté asparagus, artichoke hearts, and red onion until the onions begin to caramelize. Work in batches if needed.",
      "Deglaze the pan with vegetable broth or white wine, scraping up browned bits.",
      "Add pesto and sauté lightly until evenly distributed.",
      "Add the cooked pasta and grape tomatoes, tossing gently to combine.",
      "Plate and sprinkle with shredded mozzarella before serving.",
    ],
    notes: "For a vegan version, use dairy-free mozzarella.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/asparagus-pesto-pasta-recipe-e1759987767584.png",
    ],
  },
  "baked-broccoli-cauliflower-casserole": {
    name: "Baked Broccoli & Cauliflower Casserole",
    category: "Entree",
    description:
      "A creamy, wholesome bake featuring broccoli, cauliflower, and a rich cashew-based sauce. Perfect for a light dinner or hearty side — vegan, gluten-free, and full of comfort.",
    components: {
      Vegetables: [
        { amount: 0.67, unit: "cup", ingredient: "broccoli florets" },
        { amount: 0.67, unit: "cup", ingredient: "cauliflower florets" },
      ],
      Sauce: [
        { amount: 0.17, unit: "cup", ingredient: "raw cashews", prep: "soaked 20 min in hot water" },
        { amount: 0.08, unit: "cup", ingredient: "unsweetened almond milk" },
        { amount: 0.5, unit: "tbsp", ingredient: "nutritional yeast" },
        { amount: 0.17, unit: "tbsp", ingredient: "salt" },
        { amount: 0.33, unit: "tbsp", ingredient: "olive oil" },
        { amount: 0.33, unit: "tsp", ingredient: "cornstarch" },
        { amount: 0.33, unit: "", ingredient: "garlic cloves", prep: "minced" },
        { amount: 0.08, unit: "tsp", ingredient: "black pepper" },
        { amount: 0.17, unit: "tsp", ingredient: "onion powder" },
        { amount: 0.17, unit: "tbsp", ingredient: "lemon juice" },
      ],
      Topping: [
        { amount: 0.08, unit: "cup", ingredient: "breadcrumbs", prep: "optional" },
        { amount: 0.33, unit: "tbsp", ingredient: "parsley", prep: "chopped, optional garnish" },
      ],
    },
    instructions: [
      "Preheat oven to 375°F (190°C). Lightly oil or spray the baking dish.",
      "Bring a pot of salted water to a boil. Add broccoli and cauliflower florets; blanch for 3–4 minutes. Drain and set aside.",
      "In a blender or food processor, combine soaked cashews, almond milk, nutritional yeast, salt, olive oil, cornstarch, garlic, black pepper, onion powder, and lemon juice. Blend until smooth and creamy.",
      "In a large skillet, toss the blanched vegetables with the sauce until evenly coated.",
      "Transfer mixture to the baking dish. Sprinkle breadcrumbs on top if desired.",
      "Bake uncovered for 20–25 minutes, until golden and bubbling.",
      "Garnish with chopped parsley before serving.",
    ],
    notes:
      "For a nut-free version, substitute sunflower seeds for cashews. For extra texture, mix some breadcrumbs into the sauce before baking.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/veganbrocbake2-960x1091-1-e1758839096976.jpg",
    ],
  },
  "mushroom-root-vegetable-bourguignon": {
    name: "Mushroom Root Vegetable Bourguignon with Mashed Potatoes",
    category: "Side",
    description:
      "A cozy, one-pot vegan stew featuring mushrooms, carrots, and onions simmered in a rich red wine broth. Served over creamy mashed potatoes for the perfect cold-day comfort meal.",
    components: {
      Base: [
        { amount: 1, unit: "serving", ingredient: "Best Dang Vegan Mashed Potatoes", prep: "or rice or pasta" },
      ],
      Bourguignon: [
        { amount: 0.5, unit: "tbsp", ingredient: "olive oil", prep: "divided" },
        { amount: 4, unit: "oz", ingredient: "cremini mushrooms", prep: "sliced" },
        { amount: 1.25, unit: "", ingredient: "carrots", prep: "peeled and cut into chunks" },
        { amount: 0.25, unit: "large", ingredient: "sweet onion", prep: "diced" },
        { amount: 1, unit: "clove", ingredient: "garlic", prep: "minced" },
        { amount: 0.38, unit: "cup", ingredient: "red wine", prep: "such as Pinot Noir" },
        { amount: 0.5, unit: "cup", ingredient: "vegetable broth" },
        { amount: 0.5, unit: "tbsp", ingredient: "tomato paste" },
        { amount: 0.5, unit: "tsp", ingredient: "dried thyme" },
        { amount: 0.5, unit: "tsp", ingredient: "dried oregano" },
        { amount: 0.25, unit: "tsp", ingredient: "salt", prep: "plus more to taste" },
        { amount: 1, unit: "shake", ingredient: "black pepper", prep: "1–2 shakes" },
        { amount: 0.5, unit: "tbsp", ingredient: "all-purpose flour" },
        { amount: 1, unit: "tbsp + 1 tsp", ingredient: "water" },
      ],
    },
    instructions: [
      "Heat half the olive oil in a pot over medium heat. Add mushrooms and a pinch of salt. Sauté for 8–10 minutes, until browned and softened. Transfer to a plate.",
      "Add remaining olive oil, carrots, and onions to the same pot. Sauté for 5 minutes, then add garlic and cook 1 more minute until fragrant.",
      "Pour in red wine and vegetable broth, then stir in tomato paste, thyme, oregano, salt, and pepper. Bring to a boil, reduce heat, and simmer covered for 15 minutes.",
      "In a small bowl, mix flour with water until smooth. Add to the pot and stir to thicken.",
      "Return the mushrooms to the pot. Cover and simmer 15 more minutes, stirring occasionally until thick and stew-like.",
      "Serve hot over mashed potatoes, rice, or pasta. Enjoy!",
    ],
    notes:
      "For a gluten-free version, substitute cornstarch for the flour. The red wine adds depth but can be replaced with extra broth if preferred.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2024/08/mushroom-bourguignon-recipe-twospoons-1-scaled-1.jpg",
      "https://www.noracooks.com/wp-content/uploads/2021/02/144A2576.jpg",
      "https://www.noracooks.com/wp-content/uploads/2021/02/144A2577.jpg",
      "https://www.noracooks.com/wp-content/uploads/2021/02/144A2578.jpg",
    ],
  },
  "cajun-three-bean-stew": {
    name: "Cajun Three-Bean Stew",
    category: "Soup",
    description:
      "A hearty, smoky vegetarian stew inspired by Medieval Times' vegetarian chili. Made with fire-roasted tomatoes, Cajun spices, and tender beans served alongside roasted potatoes and brown rice for a satisfying, comforting meal.",
    components: {
      "Three Bean Stew": [
        { amount: 0.17, unit: "tbsp", ingredient: "olive oil" },
        { amount: 0.17, unit: "small", ingredient: "onion", prep: "chopped" },
        { amount: 0.33, unit: "medium", ingredient: "carrot", prep: "half finely chopped, half in chunks" },
        { amount: 0.33, unit: "", ingredient: "garlic clove", prep: "finely chopped" },
        { amount: 0.17, unit: "tsp", ingredient: "ground cumin" },
        { amount: 0.17, unit: "tsp", ingredient: "ground coriander" },
        { amount: 0.17, unit: "tsp", ingredient: "dried thyme" },
        { amount: 0.17, unit: "", ingredient: "bay leaf" },
        { amount: 0.17, unit: "tbsp", ingredient: "tomato paste" },
        { amount: 0.17, unit: "15 oz can", ingredient: "fire-roasted tomatoes" },
        { amount: 0.33, unit: "cup", ingredient: "vegetable stock", prep: "or water" },
        { amount: 0.33, unit: "cup", ingredient: "mixed beans", prep: "from ~1/3 of a 15 oz can, rinsed and drained" },
        { amount: null, unit: "", ingredient: "salt", prep: "to taste" },
        { amount: null, unit: "", ingredient: "pepper", prep: "to taste" },
        { amount: 0.08, unit: "tsp", ingredient: "hot sauce", prep: "adjust to taste" },
        { amount: 0.17, unit: "tsp", ingredient: "white wine vinegar" },
        { amount: 0.5, unit: "tbsp", ingredient: "cilantro", prep: "chopped, for garnish" },
      ],
      "Roasted Potatoes": [
        { amount: 0.5, unit: "medium", ingredient: "potato", prep: "chopped into 1-inch cubes" },
        { amount: null, unit: "", ingredient: "salt", prep: "to taste" },
        { amount: null, unit: "", ingredient: "pepper", prep: "to taste" },
        { amount: 0.33, unit: "tbsp", ingredient: "olive oil" },
        { amount: 0.33, unit: "tbsp", ingredient: "cilantro", prep: "chopped" },
      ],
      "To Serve": [
        { amount: 0.33, unit: "cup", ingredient: "cooked brown rice" },
      ],
    },
    instructions: [
      "Heat olive oil in a heavy-bottomed pan over medium heat. Add onions, carrots, and garlic. Cook 6–8 minutes until tender.",
      "Add cumin, coriander, thyme, and bay leaf. Stir well and cook 1 minute.",
      "Stir in tomato paste and fire-roasted tomatoes. Cook 1–2 minutes.",
      "Add vegetable stock or water and bring to a boil. Lower heat and simmer until carrots are tender, about 6–8 minutes.",
      "Add beans, salt, and pepper. Simmer 3–4 minutes. Turn off heat and stir in vinegar and hot sauce. Adjust seasoning. Garnish with cilantro.",
      "For roasted potatoes: Preheat oven to 450°F (230°C). Toss cubed potatoes with olive oil, salt, and pepper on a baking sheet. Roast 20–30 minutes, tossing every 10 minutes, until crisp and tender.",
      "To serve: Spoon stew into a bowl, top with roasted potatoes and brown rice, and sprinkle with cilantro.",
    ],
    notes:
      "For extra Cajun flavor, add a pinch of smoked paprika or cayenne. Can be made in the Instant Pot following similar steps with a 3-minute high-pressure cook time.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/CAJUN-THREE-BEAN-STEW.jpg",
      "https://www.cookshideout.com/wp-content/uploads/2015/02/Vegetarian-three-bean-Stew-Ingredients.jpg",
      "https://www.cookshideout.com/wp-content/uploads/2015/02/Roasted-Potatoes-Ingredients.jpg",
      "https://www.cookshideout.com/wp-content/uploads/2015/02/Vegetarian-three-bean-Stew-Step-by-Step-Photo2.jpg",
    ],
  },
  "tuscan-white-bean-kale-soup": {
    name: "Tuscan White Bean & Kale Soup",
    category: "Soup",
    description:
      "This cozy, budget-friendly soup brings together white beans, kale, and tender vegetables in a light Italian-style tomato broth. Perfect for busy cooks looking for a healthy, comforting meal that can be made on the stove or in an Instant Pot.",
    components: {
      Soup: [
        { amount: 0.2, unit: "tbsp", ingredient: "olive oil", prep: "or preferred oil" },
        { amount: 0.05, unit: "large", ingredient: "onion", prep: "diced" },
        { amount: 0.2, unit: "", ingredient: "carrot", prep: "diced" },
        { amount: 0.2, unit: "rib", ingredient: "celery", prep: "diced" },
        { amount: 0.5, unit: "clove", ingredient: "garlic", prep: "minced" },
        { amount: 0.1, unit: "28 oz can", ingredient: "diced or crushed tomatoes", prep: "undrained" },
        { amount: 0.2, unit: "15 oz can", ingredient: "white beans", prep: "cannellini or navy, drained and rinsed (~3/5 cup beans)" },
        { amount: 0.4, unit: "cup", ingredient: "vegetable broth" },
        { amount: 0.1, unit: "tsp", ingredient: "Italian seasoning" },
        { amount: 0.1, unit: "tsp", ingredient: "sea salt" },
        { amount: 0.05, unit: "tsp", ingredient: "crushed red pepper", prep: "optional" },
        { amount: 0.4, unit: "cup", ingredient: "kale", prep: "chopped, any variety" },
      ],
      Toppings: [
        { amount: null, unit: "", ingredient: "lemon zest" },
        { amount: null, unit: "", ingredient: "fresh parsley" },
        { amount: null, unit: "", ingredient: "croutons" },
        { amount: null, unit: "", ingredient: "grated Parmesan cheese", prep: "optional or vegan substitute" },
      ],
    },
    instructions: [
      "Heat olive oil in a soup pot over medium-high heat until shimmering.",
      "Add onion, carrot, celery, and garlic. Sauté a few minutes until tender, stirring as needed.",
      "Stir in tomatoes, vegetable broth, white beans, Italian seasoning, salt, and crushed red pepper (if using).",
      "Bring to a gentle boil, then reduce heat and simmer for 10–15 minutes, stirring occasionally.",
      "Stir in kale and cook until wilted and tender.",
      "Serve warm, topped with lemon zest, parsley, croutons, and Parmesan if desired.",
      "Store leftovers in an airtight container for up to 5 days, or freeze for up to 3 months.",
    ],
    notes:
      "Scaled to one cup. For a thicker texture, mash some beans before adding kale. To make it oil-free, sauté vegetables in a splash of broth instead of olive oil. Add extra broth for a lighter soup or reduce for a stew-like consistency.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/white-bean-and-kale-soup-A_39-3-e1759988680608.jpg",
    ],
  },
  "carrot-cake-cheesecake-pecan-crumble": {
    name: "Carrot Cake Cheesecake with Pecan Crumble",
    category: "Dessert",
    description:
      "A single-slice version of the rich, secretly vegan Carrot Cake Cheesecake — featuring a layer of moist spiced carrot cake made with whole wheat flour, topped with creamy brown sugar cheesecake and finished with salted caramel and crunchy pecan-oat crumble.",
    components: {
      "Carrot Cake Layer": [
        { amount: 3.33, unit: "tbsp", ingredient: "whole wheat flour", prep: "15 g" },
        { amount: 1, unit: "tbsp", ingredient: "carrots", prep: "grated, 8.5 g" },
        { amount: 1, unit: "pinch", ingredient: "baking powder" },
        { amount: 1, unit: "pinch", ingredient: "baking soda" },
        { amount: 1, unit: "small pinch", ingredient: "ground cinnamon" },
        { amount: 1, unit: "small pinch", ingredient: "ground ginger" },
        { amount: 1, unit: "small pinch", ingredient: "nutmeg" },
        { amount: 1, unit: "small pinch", ingredient: "sea salt" },
        { amount: 1, unit: "tsp", ingredient: "brown sugar", prep: "or coconut sugar, 4 g" },
        { amount: 2, unit: "tsp", ingredient: "granulated sugar", prep: "4 g" },
        { amount: 2, unit: "tsp", ingredient: "vegan butter", prep: "melted, cooled, 5 g" },
        { amount: 2, unit: "tsp", ingredient: "dairy-free yogurt", prep: "room temperature, 8 g" },
      ],
      "Cheesecake Layer": [
        { amount: 0.67, unit: "cup", ingredient: "vegan cream cheese", prep: "room temperature, 85 g" },
        { amount: 2.33, unit: "tbsp", ingredient: "dairy-free yogurt", prep: "or vegan sour cream, 35 g" },
        { amount: 2.33, unit: "tbsp", ingredient: "vegan heavy cream", prep: "or coconut cream, 35 g" },
        { amount: 2, unit: "tbsp", ingredient: "brown sugar", prep: "25 g" },
        { amount: 1.33, unit: "tbsp", ingredient: "granulated sugar", prep: "13 g" },
        { amount: 2, unit: "tsp", ingredient: "cornstarch", prep: "or arrowroot starch, 5 g" },
        { amount: 0.125, unit: "tsp", ingredient: "vanilla extract" },
        { amount: 0.0625, unit: "tsp", ingredient: "vanilla bean paste", prep: "optional" },
        { amount: 1, unit: "small pinch", ingredient: "sea salt" },
        { amount: 1, unit: "small pinch", ingredient: "ground cinnamon" },
        { amount: 1, unit: "small pinch", ingredient: "nutmeg" },
        { amount: 1, unit: "small pinch", ingredient: "ginger" },
      ],
      "Pecan Crumble Topping": [
        { amount: 1, unit: "tbsp", ingredient: "rolled oats" },
        { amount: 1, unit: "tbsp", ingredient: "pecans", prep: "chopped, or walnuts" },
        { amount: 0.5, unit: "tsp", ingredient: "maple syrup" },
        { amount: 1, unit: "tsp", ingredient: "vegan caramel sauce", prep: "store-bought or homemade" },
      ],
    },
    instructions: [
      "Preheat oven to 375°F (190°C). Line a small oven-safe ramekin or mini springform pan with parchment paper.",
      "In a bowl, whisk together whole wheat flour, baking powder, baking soda, spices, and sea salt.",
      "Stir in sugars, melted vegan butter, yogurt, and grated carrot until just combined.",
      "Pour batter into pan and bake for about 20 minutes, or until set and a toothpick comes out clean. Remove from oven and increase temperature to 400°F (200°C).",
      "In a mixing bowl, beat vegan cream cheese and yogurt until smooth. Add remaining cheesecake ingredients and beat until creamy.",
      "Pour cheesecake batter over baked carrot cake base. Bake for about 25–30 minutes, or until edges are set and top is lightly golden.",
      "Cool at room temperature for 30 minutes, then refrigerate for at least 2–3 hours or overnight.",
      "For the crumble: toss oats and pecans with maple syrup and toast at 300°F (150°C) for 3–4 minutes. Let cool.",
      "Top chilled cheesecake slice with caramel sauce and toasted crumble before serving.",
    ],
    notes:
      "Substitute coconut cream for a richer cheesecake texture. For a gluten-free version, use oat flour instead of whole wheat. Store leftovers covered in the fridge up to 4 days or freeze up to 3 months.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/09/IMG_0925-683x1024-1-e1758832659319.jpg",
      "https://onedegreeorganics.com/wp-content/uploads/2023/04/IMG_0879-1536x1024.jpg",
    ],
  },
  "maple-apple-muffin-pecan-crumble": {
    name: "Maple Apple Muffin with Pecan Crumble",
    category: "Dessert",
    description:
      "A single, cozy vegan apple spice muffin made with fresh Gala apples, warm cinnamon, nutmeg, and maple syrup — finished with a crunchy pecan crumble topping.",
    components: {
      Muffin: [
        { amount: 0.08, unit: "medium", ingredient: "Gala apple", prep: "peeled and finely chopped" },
        { amount: 0.13, unit: "cup", ingredient: "organic all-purpose flour" },
        { amount: 0.08, unit: "tsp", ingredient: "baking soda" },
        { amount: 0.04, unit: "tsp", ingredient: "baking powder" },
        { amount: 0.08, unit: "tsp", ingredient: "ground cinnamon" },
        { amount: 0.04, unit: "tsp", ingredient: "ground nutmeg" },
        { amount: 0.01, unit: "tsp", ingredient: "ground allspice" },
        { amount: 0.04, unit: "tsp", ingredient: "sea salt" },
        { amount: 0.02, unit: "cup", ingredient: "organic brown sugar" },
        { amount: 0.08, unit: "tsp", ingredient: "vanilla extract" },
        { amount: 0.06, unit: "cup", ingredient: "almond milk", prep: "or preferred plant-based milk" },
        { amount: 0.08, unit: "tbsp", ingredient: "apple cider vinegar" },
        { amount: 0.02, unit: "cup", ingredient: "pure maple syrup" },
        { amount: 0.02, unit: "cup", ingredient: "vegan butter", prep: "melted, or coconut/vegetable oil" },
      ],
      "Pecan Crumble Topping": [
        { amount: 0.08, unit: "cup", ingredient: "pecans", prep: "roughly chopped" },
        { amount: 0.04, unit: "cup", ingredient: "organic all-purpose flour" },
        { amount: 0.04, unit: "cup", ingredient: "organic brown sugar" },
        { amount: 0.08, unit: "tsp", ingredient: "ground cinnamon" },
        { amount: 0.04, unit: "tsp", ingredient: "ground nutmeg" },
        { amount: 0.02, unit: "cup", ingredient: "vegan butter", prep: "partially melted" },
      ],
    },
    instructions: [
      "In a small bowl, stir together almond milk and apple cider vinegar. Let sit for 5 minutes to create vegan 'buttermilk'.",
      "Preheat oven to 400°F (200°C). Lightly grease a muffin tin or line with a paper liner.",
      "In a large bowl, whisk melted vegan butter, maple syrup, vanilla, and almond milk mixture until combined.",
      "Add flour, baking soda, baking powder, brown sugar, spices, and salt. Stir until just combined. Fold in chopped apple — do not overmix.",
      "Spoon batter into prepared muffin cup, filling about 3/4 full.",
      "In a separate bowl, combine pecans, flour, brown sugar, cinnamon, and nutmeg. Add melted butter and mix until crumbly.",
      "Sprinkle crumble evenly over the muffin top.",
      "Bake 20–24 minutes or until a toothpick inserted in the center comes out clean. Cool before removing.",
      "Serve warm or at room temperature with coffee, tea, or plant milk.",
    ],
    notes:
      "Can be stored in the fridge up to 5 days or frozen up to 2 months. Substitute coconut oil for vegan butter if preferred. For a less sweet muffin, reduce maple syrup slightly.",
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/09/Brown-Butter-Apple-Muffins-6-e1759435417209.png",
    ],
  },
  "mango-raspberry-coconut-crumble": {
    name: "Mango & Raspberry Crumble with Toasted Coconut Topping",
    category: "Dessert",
    description:
      "A tropical twist on a classic crumble featuring mango, raspberries, and a golden coconut topping. Perfect served warm with ice cream or custard.",
    components: {
      "Mango Filling": [
        { amount: 50, unit: "g", ingredient: "fresh mango", prep: "peeled, de-stoned, and cubed" },
        { amount: 25, unit: "g", ingredient: "fresh raspberries" },
        { amount: 12.5, unit: "g", ingredient: "granulated sugar" },
        { amount: 0.25, unit: "tbsp", ingredient: "cornflour", prep: "cornstarch" },
        { amount: 0.13, unit: "tsp", ingredient: "lemon zest" },
        { amount: 0.25, unit: "tbsp", ingredient: "fresh lemon juice" },
        { amount: 0.13, unit: "tsp", ingredient: "vanilla extract" },
      ],
      "Nut & Coconut Crumble": [
        { amount: 23.75, unit: "g", ingredient: "plain flour", prep: "all-purpose" },
        { amount: 12.5, unit: "g", ingredient: "granulated sugar" },
        { amount: 6.25, unit: "g", ingredient: "desiccated coconut" },
        { amount: 0.06, unit: "tsp", ingredient: "fine salt" },
        { amount: 14.38, unit: "g", ingredient: "unsalted butter", prep: "cubed" },
        { amount: 2.5, unit: "g", ingredient: "coconut flakes" },
      ],
    },
    instructions: [
      "Preheat oven to 180°C (350°F).",
      "In a bowl, combine mango, raspberries, sugar, cornflour, lemon zest, lemon juice, and vanilla. Mix well and pour into a 1.5 L baking dish.",
      "In a separate bowl, add flour, sugar, desiccated coconut, and salt. Toss in the butter cubes and rub with fingers until mixture resembles breadcrumbs. Mix in coconut flakes.",
      "Sprinkle crumble over the fruit filling. Squeeze small clumps together for texture, but do not press down.",
      "Bake 40–50 minutes until the filling is bubbling and the crumble is golden. Cool 15 minutes before serving.",
      "Serve with vanilla ice cream, warm custard, or cold cream.",
    ],
    notes: [
      "Refrigerate up to 5 days, or freeze baked/unbaked for up to 3 months. Thaw overnight before reheating.",
      "Warm in a 180°C (350°F) oven for 15 minutes or microwave individual portions until heated through."
    ],
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/Mango-Filling-with-Coconut-Crumble.jpg",
      "https://emmaduckworthbakes.com/wp-content/uploads/2023/07/Mango-filling.jpg",
      "https://emmaduckworthbakes.com/wp-content/uploads/2023/07/Mango-filling.jpg",
      "https://emmaduckworthbakes.com/wp-content/uploads/2023/07/Crumble-Topping.jpg",
      "https://emmaduckworthbakes.com/wp-content/uploads/2023/07/Mango-Crumble.jpg",
    ],
  },
  "truffle-whipped-mashed-potatoes": {
    name: "Truffle-Whipped Mashed Potatoes",
    category: "Side",
    description:
      "Fluffy vegan mashed potatoes infused with rich white truffle oil and garlic. Perfect on their own or smothered in vegan gravy.",
    components: {
      "Mashed Potatoes": [
        { amount: 0.5, unit: "lb", ingredient: "golden potatoes", prep: "peeled and cut into 2-inch pieces" },
        { amount: 0.04, unit: "cup", ingredient: "vegan butter" },
        { amount: 0.08, unit: "cup", ingredient: "unsweetened non-dairy milk" },
        { amount: 0.17, unit: "", ingredient: "garlic clove", prep: "minced" },
        { amount: 0.17, unit: "tbsp", ingredient: "white truffle oil" },
        { amount: 0.17, unit: "tsp", ingredient: "salt", prep: "plus more to taste" },
        { amount: null, unit: "", ingredient: "black pepper", prep: "to taste" },
        { amount: null, unit: "", ingredient: "fresh chives", prep: "chopped, optional for garnish" },
      ],
    },
    instructions: [
      "Place the potatoes in a large pot and cover with water.",
      "Bring to a boil over high heat and cook 12–14 minutes, until fork-tender.",
      "Drain the potatoes in a colander and return to the pot.",
      "Add vegan butter, ½ of the milk, garlic, truffle oil, and salt.",
      "Mash until smooth, adding remaining milk as needed for consistency.",
      "Taste and season with additional salt and pepper.",
      "Garnish with chopped chives and serve with vegan gravy if desired.",
    ],
    notes: [
      "Use a hand mixer for a whipped, ultra-smooth texture.",
      "Pairs perfectly with mushroom bourguignon or lentil loaf."
    ],
    images: [
      "https://www.connoisseurusveg.com/wp-content/uploads/2018/11/truffled-mashed-potatoes-collage.jpg",
      "https://tastefulkitchen.com/wp-content/uploads/2025/09/truffled-mashed-potatoes-1-of-1.jpg",
    ],
  },
  "garlic-herb-grilled-eggplant": {
    name: "Garlic-Herb Grilled Eggplant",
    category: "Side",
    description:
      "Grilled eggplant slices, tender and flavorful, perfect as a side dish or part of a vegetable platter.",
    components: {
      Brine: [
        { amount: 1, unit: "tsp", ingredient: "fine sea salt", prep: "plus pinch, plus more for sprinkling" },
        { amount: 2.67, unit: "tbsp", ingredient: "warm water" },
        { amount: 1, unit: "cup", ingredient: "cold water", prep: "1–1 1/3 cups" },
      ],
      Vegetables: [
        { amount: 0.5, unit: "medium", ingredient: "eggplant" },
      ],
      Seasoning: [
        { amount: 1.33, unit: "tbsp", ingredient: "olive oil" },
      ],
    },
    instructions: [
      "Dissolve the fine sea salt in the warm water and mix with cold water to make the brine.",
      "Trim the stem off the eggplant and slice it into 3/4-inch thick pieces.",
      "Submerge the slices in the brine and weigh them down with a plate for 30 minutes.",
      "Preheat a grill to medium-high heat.",
      "Drain the eggplant slices and pat them dry with paper towels.",
      "Brush one side with olive oil and sprinkle with salt. Place oiled side down on the grill for about 5 minutes until grill marks appear.",
      "Brush the tops with olive oil, sprinkle with salt, flip, and grill for another 5 minutes until tender.",
      "Serve hot or at room temperature.",
    ],
    notes: [
      "Optionally, sprinkle dried or fresh oregano, parsley, or Italian seasoning on the eggplant.",
      "Minced garlic can be added to the olive oil for extra flavor.",
    ],
    images: [
      "https://www.thespruceeats.com/thmb/jbGgUyyB3EBvAuVRx0KA3V5xmO4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/perfect-grilled-eggplant-2217579-step-02-5cfb7374d06849dd84a27b50c8344beb.jpg",
      "https://www.thespruceeats.com/thmb/2KvKeNSXXuAU3UAG3ratHt8ZiXg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/perfect-grilled-eggplant-2217579-step-04-f6a87dc4cd0b43ea98d2f0c34a2405f4.jpg",
      "https://www.thespruceeats.com/thmb/ayt1m-8aRI3eWMvKD7MuYEmsKPg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/perfect-grilled-eggplant-2217579-step-05-403cd38b28fd4d75a5115a61d8cbac6b.jpg",
      "https://www.thespruceeats.com/thmb/AFkW0FKkRGtm9YQUfhBxMDA48Bs=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/perfect-grilled-eggplant-2217579-step-08-d5fa4370063e477daab2775d6873581f.jpg",
      "https://www.thespruceeats.com/thmb/MNCqzRADqtBCN1IO9lz5DKy321A=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/perfect-grilled-eggplant-2217579-step-12-f59aebce521545d881b382d71e9308d3.jpg",
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/perfect-grilled-eggplant-2217579-hero-01-5f1c71bb2b72491c8fc962992aacda1e.webp",
    ],
  },
  "garlic-ginger-roasted-carrots": {
    name: "Garlic-Ginger Roasted Carrots",
    category: "Side",
    description:
      "Quick and easy roasted carrots with garlic and ginger, perfect as a side dish.",
    components: {
      Vegetables: [
        { amount: 0.25, unit: "pounds", ingredient: "carrots" },
      ],
      Aromatics: [
        { amount: 0.38, unit: "cloves", ingredient: "garlic", prep: "minced" },
        { amount: 0.06, unit: "inch", ingredient: "ginger", prep: "minced" },
      ],
      Seasoning: [
        { amount: 0.13, unit: "tsp", ingredient: "salt" },
        { amount: 0.25, unit: "tbsp", ingredient: "canola oil" },
        { amount: 0.13, unit: "tbsp", ingredient: "olive oil" },
      ],
    },
    instructions: [
      "Preheat oven to 375°F.",
      "Peel and cut carrots into 1/2 inch rounds.",
      "Add minced garlic and ginger to the carrots.",
      "Add salt and toss with canola oil and olive oil.",
      "Spread carrots on a cookie sheet in a single layer.",
      "Roast for 25 minutes, or until slightly browned.",
    ],
    notes: [
      "You can adjust the amount of garlic and ginger to taste.",
      "Serve warm as a side dish.",
    ],
    images: [
      "https://dinnerthendessert.com/wp-content/uploads/2015/05/Ginger-Garlic-1024x682.jpg",
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/Ginger-Garlic-Carrots-1024x682-1.jpg",
    ],
  },
  "grilled-broccoli-garlic-red-pepper": {
    name: "Grilled Broccoli with Garlic Roasted Red Pepper Sauce",
    category: "Side",
    description:
      "The perfect combo of roasted red pepper, garlic, almonds, paprika, tomatoes & slightly charred broccoli. A flavorful vegan side dish for any meal.",
    components: {
      Vegetables: [
        { amount: 0.33, unit: "small head", ingredient: "broccoli", prep: "cut into florets" },
        { amount: 0.17, unit: "", ingredient: "red pepper" },
      ],
      Aromatics: [
        { amount: 0.5, unit: "cloves", ingredient: "garlic" },
      ],
      "Nuts & Seeds": [
        { amount: 0.08, unit: "cup", ingredient: "whole roasted almonds", prep: "about 0.42 oz" },
      ],
      "Spices & Seasoning": [
        { amount: 0.25, unit: "tsp", ingredient: "hot Hungarian paprika" },
        { amount: 0.25, unit: "tsp", ingredient: "smoked paprika" },
        { amount: 0.17, unit: "tsp", ingredient: "smoked salt" },
      ],
      "Bread & Grains": [
        { amount: 0.08, unit: "cup", ingredient: "crusty bread", prep: "about 0.33 oz" },
      ],
      Liquids: [
        { amount: 0.04, unit: "cup", ingredient: "extra virgin olive oil" },
        { amount: 0.17, unit: "tbsp", ingredient: "sherry vinegar", prep: "or red wine vinegar" },
        { amount: 0.33, unit: "tbsp", ingredient: "water", prep: "0.33–0.5 tbsp" },
      ],
      Other: [
        { amount: null, unit: "", ingredient: "canola oil cooking spray" },
      ],
    },
    instructions: [
      "Rinse broccoli and cut apart florets.",
      "Slice pepper in half and remove seeds and veins.",
      "Create a small tin foil 'boat' to roast garlic on the grill.",
      "Heat grill to 450–500°F. Place fresh garlic (skin removed) in the tin foil and roast for 2–3 minutes without burning.",
      "Spray the pepper with canola spray and grill until skin is charred, about 3–4 minutes per side.",
      "Place garlic and peppers in a medium bowl and cover with foil. Once cooled, remove pepper skin.",
      "In a food processor, combine roasted cherry tomatoes (scaled: ~0.83 oz), almonds, both paprikas, smoked salt, bread, sherry vinegar, roasted garlic, roasted red peppers, and olive oil. Process until smooth, adding water as needed.",
      "Turn grill to 400°F, spray broccoli with cooking spray, and grill on indirect heat for 13–15 minutes, rotating every 2–3 minutes to achieve a slight char.",
      "Serve immediately, topped with the Garlic Roasted Red Pepper Sauce.",
    ],
    notes: [
      "Cherry tomatoes can be roasted or store-bought.",
      "Bread should be crisp but not burnt.",
    ],
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2025/07/5a-roasted-broccoli-and-sweet-potatoes.jpg",
      "https://tasteandsee.com/wp-content/uploads/2016/07/ECU-EL-broccoli-good-3.jpg",
      "https://tasteandsee.com/wp-content/uploads/2016/07/EL-ECU-bright-sauceE.jpg",
    ],
  },
  "orange-basil-tofu-puffs": {
    name: "Orange and Basil Tofu Puffs",
    category: "Side",
    description:
      "Crispy baked tofu tossed in a sticky, sweet orange sauce for a delicious Chinese takeout-inspired meal. Serve with rice and green onions.",
    components: {
      "Crispy Baked Tofu": [
        { amount: 0.4, unit: "block", ingredient: "extra-firm tofu", prep: "~112-128 g" },
        { amount: 0.4, unit: "tbsp", ingredient: "oil", prep: "or low sodium soy sauce for oil-free" },
        { amount: 0.4, unit: "tbsp", ingredient: "cornstarch" },
      ],
      "Sticky Orange Sauce": [
        { amount: 0.2, unit: "cup", ingredient: "vegetable broth" },
        { amount: 0.1, unit: "cup", ingredient: "orange juice", prep: "fresh squeezed, ~0.5 orange" },
        { amount: 0.1, unit: "cup", ingredient: "organic sugar", prep: "or coconut sugar, brown sugar, or maple syrup" },
        { amount: 0.067, unit: "cup", ingredient: "rice vinegar", prep: "~1 tbsp + 1 tsp" },
        { amount: 0.05, unit: "cup", ingredient: "low sodium soy sauce", prep: "~1 tbsp" },
        { amount: 0.6, unit: "clove", ingredient: "garlic", prep: "minced" },
        { amount: 0.4, unit: "tsp", ingredient: "fresh ginger", prep: "grated, or 0.05 tsp ground ginger" },
        { amount: 0.2, unit: "tsp", ingredient: "Sriracha hot sauce", prep: "or to taste" },
        { amount: 0.4, unit: "tsp", ingredient: "cornstarch" },
        { amount: 0.05, unit: "cup", ingredient: "water", prep: "~1 tbsp" },
      ],
      "For serving": [
        { amount: 0.8, unit: "cup", ingredient: "cooked rice", prep: "0.8–1 cup" },
        { amount: 0.4, unit: "tbsp", ingredient: "green onions", prep: "chopped, 0.4–0.6 tbsp" },
      ],
    },
    instructions: [
      "Press the tofu by wrapping in paper towels or a clean dry tea towel. Place a plate or pan on top and put a couple of heavy books on top. Let the tofu press for at least 30 minutes if possible, up to 1 hour.",
      "Preheat oven to 400°F. Line a baking sheet with parchment paper or spray with oil.",
      "Slice the tofu into 1-inch cubes and place in a large ziplock bag. Add olive oil (or soy sauce) and cornstarch. Close the bag and shake gently to coat the tofu evenly.",
      "Arrange tofu on the prepared pan. Bake 15 minutes, flip, and bake another 15 minutes until crispy and lightly golden. Remove from oven.",
      "For the orange sauce, in a large pan add all sauce ingredients except cornstarch and water. Bring to a boil for 1-2 minutes.",
      "Mix cornstarch and water in a small bowl, then add to the sauce. Stir over medium-high heat until sauce thickens.",
      "Add baked tofu to the sauce and stir to coat.",
      "Serve tofu over rice, sprinkle with green onions. Optionally, add sesame seeds or a side of steamed broccoli or cauliflower.",
    ],
    notes: [
      "This recipe can be oil-free by using soy sauce instead of olive oil.",
      "Adjust sweetness or spice in the sauce to taste.",
    ],
    images: [
      "https://tastefulkitchen.com/wp-content/uploads/2024/10/orangebasiltofupuffs.png",
    ],
  },
};
