# CookMode V2 - Supabase Setup Instructions

## Overview
CookMode V2 now has real-time collaboration! When one cook checks off an ingredient or completes a step, all other tablets see the update instantly.

## Setup Steps

### 1. Run the SQL Schema in Supabase

1. Go to your Supabase project: https://app.supabase.com/projects
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Open the file `supabase-schema.sql` and copy its entire contents
6. Paste into the SQL Editor
7. Click **"Run"** (or press Cmd+Enter)
8. You should see: `Database schema created successfully!`

### 2. Get Your Supabase Credentials

1. In Supabase, go to **Project Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Configure Your App

1. Open `supabase-config.js`
2. Replace the placeholder values:

```javascript
export const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT.supabase.co',  // ← Paste your Project URL here
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ← Paste your anon key here
};
```

3. Save the file

### 4. Test It!

1. Open `index.html` in your browser
2. You should see a green badge: **"Real-time Sync Active"**
3. Open the same page in a second browser tab or device
4. Click a checkbox in one tab → it should update instantly in the other tab!

## What's Synced in Real-Time?

- ✅ **Ingredient checkboxes** - All cooks see what's been gathered
- ✅ **Step completions** - Track cooking progress together
- ✅ **Recipe status** - Gathered, Complete, Plated, Packed badges
- ✅ **Order counts** - Recipe multiplier slider

## Troubleshooting

### No green "Real-time Sync Active" badge?
- Check browser console for errors (F12)
- Verify your Supabase credentials in `supabase-config.js`
- Make sure you ran the SQL schema script

### Changes not syncing?
- Check that you have internet connection
- Open browser console and look for 🔔 emoji logs showing updates
- Verify the SQL tables were created in Supabase Dashboard → Database → Tables

### Console shows "Supabase not configured"?
- Update `supabase-config.js` with your real credentials

## Database Tables

The app uses 4 tables:

1. **ingredient_checks** - Tracks checked ingredients
2. **step_completions** - Tracks completed cooking steps
3. **recipe_status** - Tracks overall recipe status (gathered/complete/plated/packed)
4. **order_counts** - Tracks recipe quantity multipliers

## How It Works

1. **Optimistic UI Updates** - When you click, the UI updates instantly (no lag)
2. **Database Sync** - The change is saved to Supabase
3. **Real-time Broadcast** - Supabase broadcasts the change to all connected devices
4. **Other Devices Update** - All other tablets see the change within ~6ms

## Next Steps

- Add cook name input (currently shows "Cook" for all actions)
- Add production day planning view
- Add auto-generated shopping lists
- Add shift handoff notes

## Questions?

Check the browser console (F12) for detailed logs of what's happening. You'll see:
- `✅ Supabase connected!` when connection succeeds
- `👂 Listening for real-time updates...` when subscribed
- `🔔 Ingredient update:` when changes come in from other devices
