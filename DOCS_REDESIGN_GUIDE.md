# Documentation Redesign Implementation Guide

## Overview

This guide explains how to implement the green academic theme for your Docusaurus documentation pages, matching the style of the reference textbook at https://physicalhumanoidaitextbook.vercel.app/

## What Was Implemented

### 1. **Comprehensive Sidebar Structure** (`sidebars.js`)
- ✅ 6 main modules organized hierarchically
- ✅ Nested subcategories for each module
- ✅ Collapsible sections (Introduction expanded by default)
- ✅ Generated index pages for module overviews
- ✅ Clean, academic organization matching reference

### 2. **Green Academic Theme CSS** (`src/css/docs.css` + `src/css/custom.css`)
- ✅ Scholarly green color palette (#16A34A)
- ✅ Academic typography hierarchy
- ✅ Wide margins for readability (max-width: 850px)
- ✅ Generous line spacing (1.75)
- ✅ Section formatting with proper spacing
- ✅ Green-themed sidebar with active states
- ✅ Styled admonitions/callouts
- ✅ Code block enhancements
- ✅ Table styling
- ✅ Dark mode support

### 3. **MDX Content Templates**
- ✅ `_template-chapter.mdx` - Full chapter template with all sections
- ✅ `_template-intro.mdx` - Module introduction template
- ✅ Modular sections (Learning Objectives, Key Concepts, Technical Deep Dive, etc.)

## Files Modified/Created

```
📁 Project Root
├── sidebars.js                          [MODIFIED] - New hierarchical structure
├── docusaurus.config.js                 [MODIFIED] - Updated sidebar config
├── src/css/
│   ├── custom.css                       [MODIFIED] - Green theme + sidebar styles
│   └── docs.css                         [NEW] - Documentation page styles
└── docs/
    ├── _template-chapter.mdx            [NEW] - Chapter content template
    └── _template-intro.mdx              [NEW] - Module intro template
```

## Green Theme Color Palette

### Light Mode
```css
Primary Green:     #16A34A (Main actions, links, active states)
Dark Green:        #15803D (Hover states, emphasis)
Darker Green:      #14532D (Strong emphasis)
Light Green:       #22C55E (Highlights)
Lighter Green:     #4ADE80 (Subtle accents)
Lightest Green:    #86EFAC (Very subtle backgrounds)
```

### Dark Mode
```css
Primary:           #22C55E (Brighter for visibility)
Light:             #4ADE80
Lighter:           #86EFAC
```

## Design Specifications

### Typography

#### Content Pages
```
H1 (Page Title):   3rem (48px), weight 800, letter-spacing -0.02em
H2 (Sections):     2.25rem (36px), weight 700, border-bottom 2px
H3 (Subsections):  1.75rem (28px), weight 700
H4:                1.375rem (22px), weight 600
Body Text:         1.0625rem (17px), line-height 1.75
```

#### Responsive Breakpoints
```
Desktop (997px+):  Full sizes
Tablet (768-996):  H1: 2.5rem, H2: 2rem, H3: 1.5rem
Mobile (<768px):   H1: 2.25rem, H2: 1.75rem, H3: 1.375rem
```

### Spacing

```
Section Top Margin (H2):  4rem (64px)
Section Top Margin (H3):  3rem (48px)
Paragraph Bottom:         1.5rem (24px)
Code Block Margins:       2rem (32px)
Admonition Margins:       2rem (32px)
```

### Sidebar

```
Link Font Size:       0.9375rem (15px)
Link Padding:         0.5rem 0.75rem
Active Border:        3px solid #16A34A (left side)
Hover Background:     rgba(22, 163, 74, 0.08)
Active Background:    rgba(22, 163, 74, 0.12)
Nested Indent:        1rem with left border
```

## Installation & Setup

### Step 1: Backup Current Files

```bash
# Backup important files before making changes
cp sidebars.js sidebars.js.backup
cp docusaurus.config.js docusaurus.config.js.backup
cp src/css/custom.css src/css/custom.css.backup
```

### Step 2: Apply Changes

All changes have already been made to:
- `sidebars.js`
- `docusaurus.config.js`
- `src/css/custom.css`
- `src/css/docs.css` (new file)

### Step 3: Update Homepage Module Links

In `src/pages/index.js`, update the module links (lines 73-75):

```javascript
<Link to={`/docs/module-${idx + 1}`} className={styles.topicLink}>
```

Change to point to actual module paths:
```javascript
const moduleLinks = [
  '/docs/intro',                    // Module 1
  '/docs/module-1-ros2',            // Module 1 (generated index)
  '/docs/module-2-simulation',      // Module 2
  '/docs/module-3-isaac',           // Module 3
  '/docs/module-4-humanoid',        // Module 4
  '/docs/module-5-vla',             // Module 5
  '/docs/module-6-capstone',        // Module 6
];

<Link to={moduleLinks[idx]} className={styles.topicLink}>
```

### Step 4: Rebuild and Test

```bash
# Clear cache
rm -rf .docusaurus

# Start development server
npm start
```

Visit `http://localhost:3000/docs/intro` to see the new design.

## Creating Content Pages

### Use Template Files

1. **For Module Introductions:**
   ```bash
   cp docs/_template-intro.mdx docs/your-module/index.md
   ```

2. **For Regular Chapters:**
   ```bash
   cp docs/_template-chapter.mdx docs/your-module/chapter-name.md
   ```

### Template Structure

#### Chapter Template Includes:
```
✓ Frontmatter (id, title, sidebar_label, etc.)
✓ Main Title & Introduction
✓ Learning Objectives (in info admonition)
✓ Prerequisites
✓ Key Concepts (in tip admonition)
✓ Foundational Knowledge (multiple subsections)
✓ Technical Deep Dive
✓ Practical Examples
✓ Integration with Other Modules
✓ Best Practices
✓ Troubleshooting
✓ Summary
✓ Key Takeaways
✓ Exercises (3 levels: basic, intermediate, advanced)
✓ Further Reading
✓ Thought Questions
✓ Next Steps
✓ Glossary
```

## Admonition Usage

### Info (Learning Objectives, Key Concepts)
```mdx
:::info What You Will Learn
- Bullet points
:::
```

### Tip (Best Practices, Pro Tips)
```mdx
:::tip Remember
Important advice
:::
```

### Warning (Common Mistakes)
```mdx
:::warning Common Pitfalls
Things to avoid
:::
```

### Note (Additional Information)
```mdx
:::note Keep in Mind
Supporting information
:::
```

### Caution/Danger (Critical Issues)
```mdx
:::caution Important
Critical warnings
:::
```

## Code Block Best Practices

### Basic Code Block

````mdx
```python
# Always include comments
def example_function():
    """Docstring explaining purpose."""
    pass
```
````

### Code Block with Title

````mdx
```python title="src/robot_controller.py"
# Code with filename
```
````

### Code Block with Line Highlighting

````mdx
```python {2,4-6}
# Line 2 and lines 4-6 will be highlighted
def example():
    highlighted = True
    also_highlighted = True
    still_highlighted = True
    and_this = True
    normal_again = False
```
````

## Sidebar Configuration

### Adding a New Chapter

Edit `sidebars.js`:

```javascript
{
  type: 'category',
  label: 'Module 1: ROS 2 Foundations',
  items: [
    'ros2-fundamentals/index',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'ros2-fundamentals/nodes-topics',  // Add new file here
        'ros2-fundamentals/new-chapter',   // NEW CHAPTER
      ],
    },
  ],
}
```

### Changing Sidebar Order

Use `sidebar_position` in frontmatter:

```yaml
---
id: chapter-id
title: Chapter Title
sidebar_position: 5  # Controls order within category
---
```

## Styling Custom Components

### Custom Section Style

Add to `src/css/docs.css`:

```css
/* Custom section styling */
.custom-section {
  background-color: rgba(22, 163, 74, 0.05);
  border-left: 4px solid #16A34A;
  padding: 1.5rem;
  border-radius: 0 6px 6px 0;
  margin: 2rem 0;
}
```

Use in MDX:

```mdx
<div className="custom-section">

Custom content here

</div>
```

## Customization Options

### Change Green Shade

Edit `src/css/custom.css`:

```css
:root {
  /* Change primary green */
  --ifm-color-primary: #YOUR_COLOR;

  /* Regenerate shades at: docusaurus.io/docs/styling-layout */
  --ifm-color-primary-dark: #...;
  --ifm-color-primary-darker: #...;
  /* etc. */
}
```

### Adjust Content Width

Edit `src/css/docs.css`:

```css
article.markdown {
  max-width: 850px;  /* Change this value */
}
```

### Modify Section Spacing

Edit `src/css/docs.css`:

```css
article.markdown h2 {
  margin-top: 4rem;  /* Adjust spacing */
}
```

## Responsive Behavior

### Mobile Optimization

The design automatically adjusts:

- **Desktop (997px+):** Sidebar visible, full typography
- **Tablet (768-996px):** Collapsible sidebar, reduced heading sizes
- **Mobile (<768px):** Hidden sidebar (hamburger menu), mobile-optimized typography

### Testing Responsive Design

```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes
```

## Dark Mode Support

Dark mode automatically applies:
- Lighter green (#22C55E) for better visibility
- Adjusted backgrounds and borders
- Enhanced code block contrast

Test dark mode:
1. Click theme toggle in navbar
2. Verify green accents remain visible
3. Check code blocks and admonitions

## Troubleshooting

### Issue: Styles Not Applying

**Solution:**
```bash
# Clear Docusaurus cache
rm -rf .docusaurus
rm -rf build
npm start
```

### Issue: Sidebar Not Showing

**Solution:**
1. Check `sidebars.js` syntax
2. Verify file paths match actual doc locations
3. Ensure frontmatter has correct `id`

### Issue: Module Links 404

**Solution:**
1. Create actual doc files for sidebar links
2. Or remove placeholder links from `sidebars.js`
3. Update homepage module links

### Issue: Green Color Not Visible in Dark Mode

**Solution:**
Edit `src/css/custom.css`:
```css
[data-theme='dark'] {
  --ifm-color-primary: #22C55E;  /* Brighter green */
}
```

## Content Creation Workflow

### 1. Plan Your Chapter

- Define learning objectives
- Outline major sections
- Identify code examples needed
- Plan exercises

### 2. Use Template

```bash
cp docs/_template-chapter.mdx docs/module-name/chapter-name.md
```

### 3. Fill in Content

Work section by section:
1. Update frontmatter
2. Write introduction
3. Define learning objectives
4. Add technical content
5. Include code examples
6. Create exercises
7. Add further reading

### 4. Add to Sidebar

Update `sidebars.js` with new chapter

### 5. Test and Review

```bash
npm start
# Check:
# - Formatting
# - Links
# - Code blocks
# - Responsive design
```

## Best Practices

### Content Writing

1. **Use active voice:** "You will implement..." not "Implementation will be done..."
2. **Include code comments:** Every code block should have explanatory comments
3. **Provide context:** Explain why, not just what
4. **Use real examples:** Practical, copy-paste-ready code
5. **Progressive difficulty:** Start simple, build complexity

### Structure

1. **Consistent sections:** Use template structure
2. **Clear headings:** Descriptive, action-oriented
3. **Logical flow:** Each section builds on previous
4. **Visual breaks:** Use admonitions, code blocks, tables
5. **Summary reinforcement:** Recap key points

### Accessibility

1. **Alt text for images:** Always include descriptive alt text
2. **Semantic HTML:** Use proper heading hierarchy
3. **Link descriptions:** Descriptive link text (not "click here")
4. **Color contrast:** Green meets WCAG AA standards
5. **Keyboard navigation:** Test tab navigation

## Performance Optimization

### Image Optimization

```bash
# Convert images to WebP
cwebp image.png -o image.webp

# Use in MDX
![Alt text](./image.webp)
```

### Code Splitting

Docusaurus automatically code-splits by route.

### Bundle Analysis

```bash
npm run build
npm run serve
# Check browser DevTools Network tab
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build command
npm run build

# Publish directory
build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

Ensure `docusaurus.config.js` has:
```javascript
url: 'https://USERNAME.github.io',
baseUrl: '/REPO_NAME/',
organizationName: 'USERNAME',
projectName: 'REPO_NAME',
```

## Next Steps

1. **Create Content:**
   - Start with Module 1 introduction
   - Use templates for consistency
   - Fill in actual technical content

2. **Add Placeholder Pages:**
   - Create stub files for all sidebar entries
   - Add "Coming Soon" placeholders
   - Link back to completed sections

3. **Test Navigation:**
   - Click through all sidebar links
   - Verify prev/next pagination
   - Check all internal links

4. **Gather Feedback:**
   - Share with test readers
   - Get feedback on readability
   - Iterate on design

5. **Optimize:**
   - Add images and diagrams
   - Include video embeds
   - Create interactive examples

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Green Color Palette Generator](https://coolors.co/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review Docusaurus official docs
3. Inspect browser console for errors
4. Check `sidebars.js` syntax

---

**Guide Version:** 1.0.0
**Last Updated:** 2025-12-06
**Compatible With:** Docusaurus 3.x
