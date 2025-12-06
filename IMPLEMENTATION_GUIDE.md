# Implementation Guide: Homepage Redesign

## Overview
This guide will help you apply the new homepage design that matches the clean, academic aesthetic of the reference book at https://physicalhumanoidaitextbook.vercel.app/

## Files Modified

### 1. `/src/pages/index.js`
**Purpose:** Main homepage component with all sections

**Changes Made:**
- Refined hero section with cleaner title and subtitle
- Updated "What This Textbook Covers" with 6 module blocks
- Added "Open Module →" links to each module card
- Rewrote motivation section as "Why This Textbook is AI-Native & Future-Focused"
- Replaced chapters list with "Your Learning Path" CTA section
- Removed unnecessary description from hero

**Key Sections:**
1. **Hero Section:** Large title, subtitle, and 3 action buttons
2. **Module Blocks:** 6 cards showcasing the textbook structure
3. **Motivation Section:** Explains the AI-native approach
4. **Learning Path:** Final CTA to begin reading

### 2. `/src/pages/index.module.css`
**Purpose:** Component-specific styles for the homepage

**Changes Made:**
- Enhanced hero with subtle gradient background
- Improved typography scale and spacing
- Refined module cards with borders and hover effects
- Added badge-style labels for modules
- Improved responsive breakpoints for mobile/tablet
- Added smooth transitions and micro-interactions

**Design Principles:**
- Clean, academic aesthetic
- Generous whitespace (96px section padding)
- Subtle shadows and hover effects
- Professional green color palette
- Mobile-first responsive design

### 3. `/src/css/custom.css`
**Purpose:** Global styles applied across all pages

**Changes Made:**
- Defined comprehensive CSS variable system
- Updated typography hierarchy for academic feel
- Enhanced button styles with shadows
- Refined navbar with subtle backdrop blur
- Styled footer for minimalist look
- Added smooth transitions globally

**CSS Variables Defined:**
- Color system (primary, dark, light variants)
- Typography scale (6 heading levels)
- Spacing system (container widths, padding)
- Shadow system (3 levels: light, medium, tall)
- Border radius values

### 4. `/docusaurus.config.js`
**Purpose:** Site configuration and theme settings

**Changes Made:**
- Simplified navbar to just "Textbook" and "GitHub"
- Cleaned up footer with minimal links
- Updated copyright to "Built with ❤️ by Ahmed Hassan Khan"
- Enabled color mode with system preference respect
- Removed unnecessary navigation items

## Installation & Build Instructions

### Step 1: Verify All Files Are Updated
Ensure these files have been modified:
```
✓ src/pages/index.js
✓ src/pages/index.module.css
✓ src/css/custom.css
✓ docusaurus.config.js
```

### Step 2: Install Dependencies
```bash
cd F:\Coding\hackathon-ai-humaiod-book
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

Your site will open at `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Step 5: Serve Production Build Locally
```bash
npm run serve
```

View the production build at `http://localhost:3000`

## Customization Guide

### Update Module Links
In `src/pages/index.js`, lines 79-81:
```javascript
<Link to={`/docs/module-${idx + 1}`} className={styles.topicLink}>
  Open Module →
</Link>
```

Replace `/docs/module-${idx + 1}` with your actual module paths.

### Update GitHub Repository Link
In `docusaurus.config.js`, line 68:
```javascript
href: 'https://github.com/your-repo-link',
```

Replace with your actual GitHub repository URL.

### Update Social Media Links
In `docusaurus.config.js`, lines 89-101:
```javascript
{
  label: 'LinkedIn',
  href: 'https://linkedin.com/in/your-profile',
},
{
  label: 'Twitter',
  href: 'https://twitter.com/your-twitter',
},
```

### Customize Color Scheme
In `src/css/custom.css`, lines 9-15:
```css
--ifm-color-primary: #2E8555;
--ifm-color-primary-dark: #297a4d;
/* ... */
```

Use a tool like [Docusaurus Color Generator](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima) to generate a new color palette.

### Adjust Typography Scale
In `src/css/custom.css`, lines 23-31:
```css
--ifm-h1-font-size: 3rem;
--ifm-h2-font-size: 2.5rem;
/* ... */
```

### Modify Section Spacing
In `src/pages/index.module.css`, line 60:
```css
.sectionPadding {
  padding: 96px 20px;
}
```

Increase or decrease `96px` to adjust vertical spacing between sections.

## Design Specifications

### Typography Hierarchy
- **Hero Title:** 3.75rem (60px), weight 800
- **Section Headings:** 2.75rem (44px), weight 700
- **Module Headings:** 1.5rem (24px), weight 700
- **Body Text:** 1rem (16px), line-height 1.65
- **Module Labels:** 0.75rem (12px), uppercase, weight 700

### Spacing System
- **Section Padding:** 96px vertical, 20px horizontal
- **Container Max Width:** 1100px
- **Module Card Gap:** 32px
- **Button Gap:** 16px

### Color Palette
- **Primary Green:** #2E8555
- **Primary Dark:** #297a4d
- **Primary Light:** #338f5e
- **Text:** CSS variable-based (theme-aware)
- **Borders:** var(--ifm-color-emphasis-200)

### Shadow System
- **Light:** 0 2px 8px rgba(0, 0, 0, 0.04)
- **Medium:** 0 4px 16px rgba(0, 0, 0, 0.08)
- **Tall (Hover):** 0 8px 24px rgba(46, 133, 85, 0.12)

### Responsive Breakpoints
- **Desktop:** 997px and up (3-column grid)
- **Tablet:** 768px - 996px (2-column grid)
- **Mobile:** 767px and below (1-column stack)

## Override Default Docusaurus Theme

### Method 1: Using Custom CSS (Already Implemented)
All global overrides are in `src/css/custom.css` using CSS variables.

### Method 2: Component Swizzling (Advanced)
To completely replace default components:

```bash
npm run swizzle @docusaurus/theme-classic [component] -- --eject
```

Example:
```bash
npm run swizzle @docusaurus/theme-classic Footer -- --eject
```

This creates a copy of the component in `src/theme/` that you can customize.

## Testing Checklist

Before deploying, verify:

- [ ] Homepage loads without errors
- [ ] All buttons link to correct destinations
- [ ] Module cards display correctly (6 cards in grid)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark mode toggles correctly
- [ ] Hover effects work on cards and buttons
- [ ] Typography is readable and properly scaled
- [ ] Footer displays with correct copyright
- [ ] Navbar links work correctly
- [ ] Page loads quickly (check build size)

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import repository to Vercel
3. Build command: `npm run build`
4. Output directory: `build`
5. Deploy!

### Deploy to Netlify
1. Push your code to GitHub
2. Import repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `build`
5. Deploy!

### Deploy to GitHub Pages
```bash
npm run deploy
```

Ensure `docusaurus.config.js` has correct `url` and `baseUrl`.

## Troubleshooting

### Issue: Styles Not Applying
**Solution:** Clear browser cache and restart dev server
```bash
rm -rf .docusaurus
npm start
```

### Issue: Module Links 404
**Solution:** Create corresponding doc files or update links in `index.js`

### Issue: Build Fails
**Solution:** Check for syntax errors in JSX and CSS
```bash
npm run clear
npm run build
```

### Issue: Broken Responsive Layout
**Solution:** Check browser console for CSS errors and validate media queries

## Performance Optimization

### Already Implemented
- ✓ Minimal dependencies
- ✓ Optimized images (use WebP when possible)
- ✓ Efficient CSS (scoped modules)
- ✓ Lazy loading (Docusaurus default)

### Additional Recommendations
1. **Optimize images:** Convert hero illustrations to WebP
2. **Enable PWA:** Add `@docusaurus/plugin-pwa` for offline support
3. **Add sitemap:** Ensure `docs` plugin generates sitemap
4. **Setup analytics:** Add Google Analytics or Plausible

## Maintenance

### Regular Updates
1. Update module content as you add chapters
2. Keep dependencies updated (`npm outdated`)
3. Monitor build performance
4. Test on multiple devices/browsers

### Content Updates
- Module descriptions: `src/pages/index.js` (lines 35-66)
- Motivation text: `src/pages/index.js` (lines 96-98)
- Footer links: `docusaurus.config.js` (lines 76-103)

## Support & Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Infima CSS Framework](https://infima.dev/)
- [React Documentation](https://react.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Next Steps

1. **Content Creation:** Start writing your textbook modules
2. **Custom Components:** Create reusable components for diagrams, code examples
3. **Search Integration:** Add Algolia DocSearch or local search
4. **PDF Generation:** Implement PDF export functionality
5. **Interactive Examples:** Add live code sandboxes for robotics examples

---

**Last Updated:** 2025-12-06
**Version:** 1.0.0
**Author:** Ahmed Hassan Khan
