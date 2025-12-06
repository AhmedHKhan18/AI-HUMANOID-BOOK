# Expanding the Sidebar - Step by Step Guide

## Current Status

✅ **Sidebar is now working** with existing files only:
- Introduction
- Module 1: ROS 2 Foundations
- Module 2: Simulation & Digital Twins
- Module 3: NVIDIA Isaac Platform
- Module 5: Vision-Language-Action
- Appendix

## How to Add New Chapters

### Step 1: Create the Content File

```bash
# Create a new chapter file
touch docs/ros2-fundamentals/nodes-topics.md
```

### Step 2: Add Frontmatter

```yaml
---
id: nodes-topics
title: Nodes and Topics
sidebar_label: Nodes & Topics
sidebar_position: 2
---
```

### Step 3: Add to Sidebar

Edit `sidebars.js`:

```javascript
{
  type: 'category',
  label: 'Module 1: ROS 2 Foundations',
  collapsed: false,
  items: [
    'ros2-fundamentals/ros2-fundamentals-intro',
    'ros2-fundamentals/nodes-topics',  // ADD NEW FILE HERE
  ],
},
```

### Step 4: Restart Dev Server

```bash
# Kill current server (Ctrl+C)
npm start
```

## Adding Nested Categories

### Example: Add "Core Concepts" subcategory

```javascript
{
  type: 'category',
  label: 'Module 1: ROS 2 Foundations',
  collapsed: false,
  items: [
    'ros2-fundamentals/ros2-fundamentals-intro',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'ros2-fundamentals/nodes-topics',
        'ros2-fundamentals/services-actions',
      ],
    },
  ],
},
```

## Full Sidebar Template (To Use Later)

Here's the complete sidebar structure from the original design. **Save this for when you have all the files created:**

```javascript
/**
 * Complete sidebar with all planned chapters
 * USE THIS TEMPLATE AS YOU CREATE NEW FILES
 */

const sidebars = {
  textbookSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },

    // Module 1: ROS 2 Foundations
    {
      type: 'category',
      label: 'Module 1: ROS 2 Foundations',
      collapsed: false,
      items: [
        'ros2-fundamentals/ros2-fundamentals-intro',
        {
          type: 'category',
          label: 'Core Concepts',
          items: [
            'ros2-fundamentals/nodes-topics',
            'ros2-fundamentals/services-actions',
            'ros2-fundamentals/messages-interfaces',
          ],
        },
        {
          type: 'category',
          label: 'Development',
          items: [
            'ros2-fundamentals/packages-workspaces',
            'ros2-fundamentals/launch-files',
            'ros2-fundamentals/parameters-config',
          ],
        },
        {
          type: 'category',
          label: 'Robot Description',
          items: [
            'ros2-fundamentals/urdf-basics',
            'ros2-fundamentals/xacro-modular',
          ],
        },
      ],
    },

    // Add other modules as you create their files...
  ],
};
```

## Quick File Creation Script

Create all placeholder files at once:

```bash
# Module 1 files
touch docs/ros2-fundamentals/nodes-topics.md
touch docs/ros2-fundamentals/services-actions.md
touch docs/ros2-fundamentals/messages-interfaces.md
touch docs/ros2-fundamentals/packages-workspaces.md
touch docs/ros2-fundamentals/launch-files.md
touch docs/ros2-fundamentals/parameters-config.md
touch docs/ros2-fundamentals/urdf-basics.md
touch docs/ros2-fundamentals/xacro-modular.md

# Module 2 files
touch docs/robot-simulation/gazebo-intro.md
touch docs/robot-simulation/gazebo-worlds.md
touch docs/robot-simulation/gazebo-sensors.md
touch docs/robot-simulation/unity-basics.md
touch docs/robot-simulation/unity-ros-bridge.md

# Module 3 files
touch docs/nvidia-isaac-platform/isaac-sim-intro.md
touch docs/nvidia-isaac-platform/isaac-sim-assets.md
touch docs/nvidia-isaac-platform/isaac-sim-sensors.md
touch docs/nvidia-isaac-platform/isaac-ros-intro.md
touch docs/nvidia-isaac-platform/isaac-ros-perception.md
touch docs/nvidia-isaac-platform/isaac-ros-navigation.md
```

## Placeholder Content Template

Use this for new files:

```markdown
---
id: chapter-id
title: Chapter Title
sidebar_label: Short Title
sidebar_position: 1
---

# Chapter Title

:::note Coming Soon
This chapter is currently under development. Check back soon for comprehensive content on [topic].
:::

## What This Chapter Will Cover

- Topic 1
- Topic 2
- Topic 3

---

*Last Updated: [Date] | Status: 🚧 Under Construction*
```

## Workflow: Expanding Content

### Phase 1: Create Stubs
1. Create all placeholder `.md` files
2. Add basic frontmatter to each
3. Add "Coming Soon" notice
4. Update sidebar with all files
5. Test that all links work

### Phase 2: Fill Content
1. Start with Module 1
2. Use `_template-chapter.mdx` for structure
3. Fill in one chapter at a time
4. Test after each chapter

### Phase 3: Polish
1. Add code examples
2. Include diagrams
3. Create exercises
4. Add cross-references
5. Review and edit

## Common Issues

### Issue: Link 404

**Cause:** Sidebar references file that doesn't exist

**Solution:**
```bash
# Create the missing file
touch docs/path/to/file.md

# Or remove from sidebar
```

### Issue: Sidebar Category Empty

**Cause:** All files in category are commented out or missing

**Solution:**
```javascript
// Either add files or remove the category
{
  type: 'category',
  label: 'Empty Category',
  items: [
    // 'missing-file',  // Commented out
  ],
}
// Remove this whole category block
```

### Issue: Wrong Sidebar Order

**Solution:**
Use `sidebar_position` in frontmatter:
```yaml
sidebar_position: 3  # Higher number = later in list
```

## Testing Sidebar Changes

```bash
# 1. Clear cache
rm -rf .docusaurus

# 2. Restart server
npm start

# 3. Check sidebar in browser
# Navigate to http://localhost:3000/docs/intro

# 4. Click through all links
# Verify no 404 errors
```

## Best Practices

1. **Create Files Before Sidebar:** Always create the `.md` file before adding it to the sidebar

2. **Use Consistent IDs:** Match the filename:
   ```yaml
   # File: docs/module/chapter-name.md
   id: chapter-name  # Not chapter_name or chapterName
   ```

3. **Descriptive Labels:**
   ```javascript
   sidebar_label: 'Short Title'  // 2-4 words max
   ```

4. **Logical Grouping:** Group related chapters under categories

5. **Progressive Disclosure:** Keep top-level categories collapsed except for Introduction and Module 1

## Current vs. Full Sidebar

### Current (Minimal, Works Now)
```
├── Introduction
├── Module 1 (1 file)
├── Module 2 (1 file)
├── Module 3 (1 file)
├── Module 5 (1 file)
└── Appendix (1 file)
```

### Target (Full Structure)
```
├── Introduction
├── Module 1: ROS 2 (9 files in 3 categories)
├── Module 2: Simulation (5 files in 2 categories)
├── Module 3: Isaac (6 files in 2 categories)
├── Module 4: Humanoid (6 files in 2 categories)
├── Module 5: VLA (9 files in 3 categories)
├── Module 6: Capstone (6 files in 2 categories)
└── Appendix (3 files in 1 category)
```

## Next Steps

1. **Immediate:**
   ```bash
   # Test current setup
   npm start
   # Visit http://localhost:3000/docs/intro
   ```

2. **Short-term:**
   - Create stub files for Module 1 chapters
   - Add them to sidebar one at a time
   - Test after each addition

3. **Long-term:**
   - Fill in Module 1 content using templates
   - Expand to other modules
   - Add diagrams and examples

## Reference

- Full sidebar template: See code block above
- Content templates: `docs/_template-chapter.mdx` and `docs/_template-intro.mdx`
- Implementation guide: `DOCS_REDESIGN_GUIDE.md`
- Quick start: `DOCS_QUICK_START.md`

---

**Last Updated:** 2025-12-06
**Status:** ✅ Sidebar Working with Existing Files
**Next:** Add new chapters incrementally
