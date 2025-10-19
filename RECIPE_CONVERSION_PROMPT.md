# Recipe Conversion Prompt for ChatGPT

Use this prompt to convert your recipes.js file to the new object format.

---

## Prompt to Give ChatGPT:

```
Please convert this recipes.js file to use the new structured object format for ingredients.

CURRENT FORMAT (string):
"2 cups all-purpose flour, sifted"
"1/4 tsp salt"
"0.5 lb butter, softened"

NEW FORMAT (object):
{ amount: 2, unit: 'cups', ingredient: 'all-purpose flour', prep: 'sifted' }
{ amount: 0.25, unit: 'tsp', ingredient: 'salt' }
{ amount: 0.5, unit: 'lb', ingredient: 'butter', prep: 'softened' }

RULES:
1. Convert all string ingredients to objects with these fields:
   - amount: number or fraction string ('1/2', '1/4', '1/3')
   - unit: string (cup, tbsp, tsp, oz, lb, cloves, large, medium, etc.)
   - ingredient: string (the ingredient name)
   - prep: string (optional - any preparation notes like "diced", "minced", "softened")

2. For fractions:
   - Convert decimal fractions to fraction strings if cleaner: 0.5 → '1/2', 0.25 → '1/4', 0.33 → '1/3'
   - Keep numbers for whole amounts: 2, 5, 10

3. For prep notes:
   - Text after commas usually goes in 'prep' field
   - Examples: "diced", "minced", "softened", "plus more to taste", "divided"

4. Preserve all other recipe fields (name, category, instructions, notes, images)

5. Keep the same recipe structure - only change ingredient arrays

Here is the file to convert:

[PASTE YOUR ENTIRE recipes.js FILE HERE]
```

---

## Example Conversion:

### BEFORE (Old String Format):
```javascript
'truffle-mashed-potatoes': {
    name: 'Truffle Mashed Potatoes',
    category: 'Side',
    components: {
        'Potatoes': [
            '5 lb russet potatoes, peeled and quartered',
            '1 cup heavy cream',
            '0.5 cup butter, softened',
            '2 tbsp truffle oil',
            '1 tsp salt',
            '0.25 tsp black pepper'
        ]
    },
    instructions: [
        'Boil potatoes until tender.',
        'Mash with cream and butter.',
        'Stir in truffle oil and seasonings.'
    ]
}
```

### AFTER (New Object Format):
```javascript
'truffle-mashed-potatoes': {
    name: 'Truffle Mashed Potatoes',
    category: 'Side',
    components: {
        'Potatoes': [
            { amount: 5, unit: 'lb', ingredient: 'russet potatoes', prep: 'peeled and quartered' },
            { amount: 1, unit: 'cup', ingredient: 'heavy cream' },
            { amount: '1/2', unit: 'cup', ingredient: 'butter', prep: 'softened' },
            { amount: 2, unit: 'tbsp', ingredient: 'truffle oil' },
            { amount: 1, unit: 'tsp', ingredient: 'salt' },
            { amount: '1/4', unit: 'tsp', ingredient: 'black pepper' }
        ]
    },
    instructions: [
        'Boil potatoes until tender.',
        'Mash with cream and butter.',
        'Stir in truffle oil and seasonings.'
    ]
}
```

---

## After Conversion:

1. Copy the converted code from ChatGPT
2. Replace the contents of recipes.js with the new version
3. Test in the browser (the components are already updated to support this format!)
4. If you see any errors, check the browser console for details

---

## Validation Checklist:

After conversion, verify:
- [ ] All ingredients have `amount`, `unit`, `ingredient` fields
- [ ] Prep notes are in the optional `prep` field
- [ ] Fractions use strings: '1/2', '1/4', '1/3'
- [ ] Whole numbers are numbers: 2, 5, 10
- [ ] No trailing commas in arrays/objects
- [ ] Recipe names, categories, instructions unchanged
- [ ] File exports correctly: `export const RECIPES = { ... };`
