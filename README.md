# CookMode V2

**[DEMO OF THE APP](https://adamfehse.github.io/cookmodeV2/)**


**Recipe Management & Kitchen Operations Dashboard**

A real-time kitchen management system designed to connect chefs, cooks, and operations through unified recipe cards, live prep tracking, and instant order coordination.

---

## The Problem

In most kitchens, critical information lives in multiple places:
- **Chefs** work from structured prep sheets and order management systems
- **Cooks** work from printed recipes, memory, or hastily written notes
- **Managers** track orders and status separately

This fragmentation creates delays, errors, and misalignment when the team needs it most.

## The Solution

CookMode unifies kitchen operations around a single source of truth. Recipe cards pull directly from your master data, live updates keep everyone in sync, and chef assignments flow seamlessly from planning to execution.

**Real results:** 40% increase in orders per service + 20% reduction in labor waste

---

## Key Features

 **Live Recipe Cards** — Clear instructions, ingredient lists, and images at your fingertips

 **Smart Scaling** — Adjust quantities on the fly for multiple orders

 **Chef Assignments** — See who's cooking what, with automatic color badges for quick visual reference

 **Real-time Sync** — Changes appear instantly across all kitchen screens and devices

 **Prep Tracking** — Check off ingredients and steps as they're completed

 **Multi-Device Ready** — Works seamlessly on phones, tablets, and kitchen displays

---

## How It Works

1. **Recipe Data** — Recipes are organized by component (sauce, pasta, garnish, etc.) with precise measurements and prep notes
2. **Chef Assignments** — Assign recipes to chefs; ingredients automatically consolidate across their dishes
3. **Live Tracking** — Cooks mark ingredients and steps complete; status updates in real-time for all viewers
4. **Smart Dashboard** — See kitchen-wide progress at a glance, or drill into individual chef prep lists

---

## Quick Start

### Setup
1. Clone this repository
2. Update `supabase-config.js` with your database credentials
3. Run `reset-database.sql` in your Supabase SQL editor to initialize tables
4. Open `index.html` in a browser

### Adding Recipes
Edit `recipes.js` and add recipes following this structure:

```javascript
{
  "recipe-slug": {
    name: "Recipe Name",
    category: "Entree|Side|Soup|Dessert",
    components: {
      "Component Name": [
        { amount: 1, unit: "cup", ingredient: "item", prep: "chopped" }
      ]
    },
    instructions: ["Step 1...", "Step 2..."],
    images: ["image-url"]
  }
}
```

### Database
- Recipes are stored in code (`recipes.js`)
- Live data (completions, chef assignments, orders) syncs with Supabase
- Reset all kitchen data anytime with `reset-database.sql`

---

## Why CookMode

### For Cooks
- Clear, step-by-step recipes with images
- Know exactly what's in each dish and how much
- Mark progress and see what's next
- Responsive design works on any device

### For Chefs & Managers
- Unified view of all dishes in prep
- Real-time status from the kitchen floor
- Chef assignments with automatic consolidation
- Export and plan week-long prep cycles

### For the Business
- Fewer mistakes, faster service
- Better labor efficiency
- Scalable without adding complexity
- Mobile-first — works anywhere

---

## Project Structure

```
├── index.html                 # Entry point & script loader
├── recipes.js                 # Master recipe database
├── supabase-config.js         # Database connection
├── js/
│   ├── components/            # React components (App, Modals, Grid, etc.)
│   ├── components/chef/       # Chef-specific features (assignments, prep tracking)
│   ├── hooks/                 # Data & Supabase integration
│   ├── utils/                 # Helpers (scaling, keys, colors)
│   └── constants/             # Chef color system & globals
├── styles/
│   ├── theme.css              # Design tokens & colors
│   ├── main.css               # CSS orchestration
│   └── components/            # Component styles
└── reset-database.sql         # Database initialization
```

---

## No Build Process

This is intentional. CookMode runs entirely in the browser with React via CDN and Babel for in-browser JSX transformation. No npm, no build step, no complexity — just open and use.

---

## Tech Stack

- **React 18** (via CDN)
- **Supabase** (real-time database)
- **Pico CSS** (lightweight framework)
- **Vanta.js** (animated background)
- Vanilla JavaScript (no TypeScript, no build tools)

---

## Perfect For

- Independent restaurants and ghost kitchens
- Meal prep services and catering operations
- Food trucks and pop-up restaurants
- Any team that cooks together and needs to stay aligned

---

## Contact & Support

Built with ❤️ for kitchens that value **clarity, speed, and teamwork**.

Questions? Issues? Ideas? [Open an issue](https://github.com/AdamFehse/cookmodeV2/issues) or reach out.

---

**CookMode:** For the cooks. By the cooks. ✨
