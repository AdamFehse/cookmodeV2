# CookMode V2 Skills Guide

## What Are Skills?

Skills are specialized AI agents that help manage specific aspects of your CookMode V2 project. They provide focused context and instructions for common tasks, helping maintain consistency and reducing context loss in long conversations.

## The Problem Skills Solve

**"Ongoing sessions are the LLM equivalent of Alzheimer's"** - As conversations grow, Claude can:
- Lose track of project structure
- Forget established patterns
- Make inconsistent decisions
- Suggest changes that contradict earlier work

Skills solve this by providing **focused, persistent context** that loads when needed.

## How Skills Work

### Progressive Loading Model

Skills use a three-tier loading system:

1. **Metadata** (always loaded)
   - Skill name and description
   - Helps Claude decide when to invoke

2. **Instructions** (triggered when relevant)
   - SKILL.md content loads when skill matches task
   - Provides specialized guidance

3. **Resources** (loaded as needed)
   - Additional files only load when referenced
   - Keeps context small until needed

### File Structure

```
.claude/skills/
├── skill-name/
│   ├── SKILL.md           # Required: Instructions with YAML frontmatter
│   ├── REFERENCE.md       # Optional: Additional documentation
│   ├── EXAMPLES.md        # Optional: Code examples
│   └── scripts/           # Optional: Helper scripts
│       └── helper.py
```

### SKILL.md Format

Every skill needs a SKILL.md file with YAML frontmatter:

```yaml
---
name: Your Skill Name                    # Max 64 characters
description: What this skill does and when to use it  # Max 1024 characters
---

# Skill Instructions

Your detailed instructions go here...
```

**Critical**: The description should clearly explain:
1. What the skill does
2. When Claude should use it
3. When NOT to use it

## CookMode V2 Skills

### 1. Source of Truth
**Purpose**: Documents the codebase as it exists
**Use when**: Need factual information about implementation
**Location**: `.claude/skills/source-of-truth/`

**Key principle**: NEVER suggests improvements unless asked. Only documents what exists.

Example usage:
- "Where is the recipe scaling implemented?"
- "How does real-time sync work?"
- "What components are involved in the modal?"

### 2. Recipe Manager
**Purpose**: Manages recipe data in recipes.js
**Use when**: Adding/editing recipe entries
**Location**: `.claude/skills/recipe-manager/`

Ensures recipes follow the correct schema and formatting.

Example usage:
- "Add a new recipe for chocolate cake"
- "Fix the ingredient formatting in truffle potatoes"
- "Validate all recipe structures"

### 3. Database Manager
**Purpose**: Manages Supabase schema and migrations
**Use when**: Database changes needed
**Location**: `.claude/skills/database-manager/`

Handles SQL migrations, RLS policies, and real-time config.

Example usage:
- "Add a new table for recipe ratings"
- "Create migration to add priority column"
- "Update RLS policy for recipe_status"

## Creating New Skills

### Step 1: Plan the Skill

Ask yourself:
1. What specific task does this skill handle?
2. When should Claude invoke it?
3. What context is needed?
4. What should it NOT do?

### Step 2: Create Directory

```bash
mkdir -p .claude/skills/my-skill-name
```

### Step 3: Write SKILL.md

```markdown
---
name: My Skill Name
description: Clear description of what this does and when to use it
---

# My Skill Instructions

## Your Role
Define what this skill agent does...

## When to Use This Skill
List specific triggers...

## Constraints
What this skill should NOT do...

## Guidelines
Detailed instructions...
```

### Step 4: Add Supporting Files (Optional)

```
.claude/skills/my-skill/
├── SKILL.md
├── REFERENCE.md      # API docs, schemas, etc.
├── EXAMPLES.md       # Code examples
└── scripts/
    └── helper.sh
```

### Step 5: Test the Skill

Ask Claude to perform a task the skill should handle. Check:
- Does it invoke the skill automatically?
- Does it follow the skill's constraints?
- Is the output consistent with skill guidelines?

## Best Practices

### Writing Effective Skills

1. **Be Specific**: Narrow scope = better results
   - ✅ "Manages Supabase migrations"
   - ❌ "Handles database stuff"

2. **Clear Boundaries**: Define what the skill does NOT do
   - Prevents skill overlap
   - Reduces confusion

3. **Include Examples**: Show correct patterns
   - Code snippets
   - Before/after examples
   - Common mistakes to avoid

4. **Stay Current**: Update skills as project evolves
   - Document recent changes
   - Remove outdated information
   - Add new patterns

### Skill Naming

- Use kebab-case: `recipe-manager`, not `RecipeManager`
- Be descriptive: `database-manager`, not `db`
- Keep it short: `source-of-truth`, not `source-of-truth-documentation-agent`

### Description Writing

Good descriptions include:
1. Primary function
2. When to use
3. Key capabilities

Example:
```yaml
description: Manages Supabase database schema, migrations, and queries. Use when creating/modifying tables, writing migrations, or troubleshooting database issues.
```

## Using Skills Effectively

### When to Invoke Skills

Let Claude decide automatically, but you can also:
- Explicitly request: "Use the Recipe Manager skill to add this recipe"
- Reference context: "According to the Source of Truth skill..."

### Combining Skills

Skills can work together:
1. **Source of Truth** → Document current state
2. **Recipe Manager** → Add new recipe
3. **Database Manager** → Update schema if needed

### Skill Maintenance

Regular updates keep skills effective:

**Weekly**: Review for outdated information
**After major changes**: Update skill context
**When adding features**: Create new skill or extend existing

## Common Patterns

### Pattern 1: Source-of-Truth Agent

```yaml
---
name: Project Documentation
description: Documents codebase without suggesting changes. Use when user needs factual information about implementation.
---

# CRITICAL: ONLY DOCUMENT, NEVER SUGGEST

Your sole job is to explain what exists...
```

### Pattern 2: Feature-Specific Agent

```yaml
---
name: Recipe Manager
description: Adds and edits recipe data. Use when user wants to create or modify recipes.
---

# Recipe Manager

You specialize in recipe data management...
```

### Pattern 3: Infrastructure Agent

```yaml
---
name: Database Manager
description: Manages database schema and migrations. Use when user needs database changes.
---

# Database Manager

You handle all database operations...
```

## Scaling Up

### From 3 Skills to More

Once your first 3 skills are working:

1. **Identify Gaps**: What tasks don't fit existing skills?
2. **Create Specialized Skills**: Break down complex areas
3. **Use Source-of-Truth**: Verify new skills align with current state
4. **Document Relationships**: How skills interact

### Suggested Additional Skills for CookMode V2

- **Component Builder**: Create new React components
- **Style Manager**: Manage Pico CSS overrides
- **Real-time Debugger**: Troubleshoot Supabase sync issues
- **Testing Assistant**: Write and run tests
- **Deployment Manager**: Handle build and deploy

## Troubleshooting

### Skill Not Activating

**Check**:
- Is description clear about when to use?
- Does task match skill's stated purpose?
- Is YAML frontmatter formatted correctly?

**Fix**:
- Make description more specific
- Explicitly invoke skill by name
- Verify SKILL.md is in correct location

### Skill Giving Wrong Guidance

**Check**:
- Is skill context outdated?
- Has project structure changed?
- Are there conflicting skills?

**Fix**:
- Update skill documentation
- Remove outdated information
- Clarify skill boundaries

### Skills Conflicting

**Check**:
- Do descriptions overlap?
- Are boundaries unclear?

**Fix**:
- Narrow each skill's scope
- Add "When NOT to use" sections
- Create higher-level orchestration skill

## Maintenance Checklist

Use this checklist to keep skills healthy:

### After Each Major Feature
- [ ] Update affected skill(s)
- [ ] Add new examples
- [ ] Remove outdated references
- [ ] Test skill invocation

### Monthly Review
- [ ] Read through each skill
- [ ] Verify accuracy of implementation details
- [ ] Update file paths if moved
- [ ] Check for contradictions between skills

### When Adding New Skill
- [ ] Clear, unique purpose
- [ ] No overlap with existing skills
- [ ] YAML frontmatter validates
- [ ] Includes examples
- [ ] Tested with real tasks

## Resources

### Official Documentation
- [Claude Code Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)

### Project Files
- Skills directory: `.claude/skills/`
- Project docs: `CLAUDE.md`
- This guide: `.claude/SKILLS_GUIDE.md`

## Remember

Skills are not magic - they're **organized context**. The better you maintain them, the more effective they become.

Think of skills as specialized team members:
- **Source of Truth**: The historian
- **Recipe Manager**: The data curator
- **Database Manager**: The DBA

Each has expertise, and together they help you maintain CookMode V2 efficiently!
