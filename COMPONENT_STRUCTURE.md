# Component Structure Reference

## Homepage Component Hierarchy

```
Home (Layout)
│
├── HomepageHero
│   ├── heroSection (header)
│   │   └── heroContent (div)
│   │       ├── heroTitle (h1)
│   │       ├── heroSubtitle (p)
│   │       └── heroButtons (div)
│   │           ├── button (Start Reading →)
│   │           ├── button (Download PDF)
│   │           └── button (GitHub Repo)
│
├── main
│   ├── WhatThisBookCovers (section)
│   │   └── container (div)
│   │       ├── sectionHeading (h2)
│   │       └── topicBlocksGrid (div)
│   │           └── topicBlock × 6 (div)
│   │               ├── topicLabel (span) - "Module 1"
│   │               ├── topicHeading (h3) - "ROS 2 Foundations"
│   │               ├── topicDescription (p)
│   │               └── topicLink (Link) - "Open Module →"
│   │
│   ├── MotivationSection (section)
│   │   └── containerWide (div)
│   │       ├── sectionHeading (h2)
│   │       └── motivationText (p)
│   │
│   └── ChaptersOverview (section)
│       └── container (div)
│           ├── sectionHeading (h2)
│           ├── pathDescription (p)
│           └── ctaButtons (div)
│               ├── button (Begin Your Journey →)
│               └── button (View Table of Contents)
```

## CSS Class Reference

### Hero Section Classes
```css
.heroSection          /* Main hero container with gradient */
.heroContent          /* Content wrapper, max-width 900px */
.heroTitle            /* 3.75rem, weight 800 */
.heroSubtitle         /* 1.375rem, secondary color */
.heroButtons          /* Flex container, gap 16px */
.heroButton           /* Button styles with shadow */
```

### Module Section Classes
```css
.sectionPadding       /* 96px vertical padding */
.container            /* Max-width 1100px */
.sectionHeading       /* 2.75rem, centered */
.topicBlocksGrid      /* Grid, auto-fit, min 320px */
.topicBlock           /* Card with border and shadow */
.topicLabel           /* Badge style, uppercase */
.topicHeading         /* 1.5rem, weight 700 */
.topicDescription     /* 1rem, line-height 1.65 */
.topicLink            /* Inline-flex with arrow */
```

### Motivation Section Classes
```css
.motivationSection    /* Gradient background */
.containerWide        /* Max-width 1200px */
.motivationText       /* 1.125rem, centered */
```

### Learning Path Classes
```css
.learningPathSection  /* Final CTA section */
.pathDescription      /* Description text */
.ctaButtons           /* Button container */
```

## Data Structure

### TopicBlocks Array
```javascript
[
  {
    label: 'Module 1',
    heading: 'ROS 2 Foundations',
    description: 'Master the Robot Operating System...'
  },
  // ... 5 more modules
]
```

Map function creates:
- 6 module cards
- Each with label, heading, description, link
- Link format: `/docs/module-${idx + 1}`

## Responsive Behavior

### Desktop (997px+)
```
┌─────────┬─────────┬─────────┐
│ Module  │ Module  │ Module  │
│    1    │    2    │    3    │
├─────────┼─────────┼─────────┤
│ Module  │ Module  │ Module  │
│    4    │    5    │    6    │
└─────────┴─────────┴─────────┘
```

### Tablet (768-996px)
```
┌─────────┬─────────┐
│ Module  │ Module  │
│    1    │    2    │
├─────────┼─────────┤
│ Module  │ Module  │
│    3    │    4    │
├─────────┼─────────┤
│ Module  │ Module  │
│    5    │    6    │
└─────────┴─────────┘
```

### Mobile (<768px)
```
┌─────────────────┐
│    Module 1     │
├─────────────────┤
│    Module 2     │
├─────────────────┤
│    Module 3     │
├─────────────────┤
│    Module 4     │
├─────────────────┤
│    Module 5     │
├─────────────────┤
│    Module 6     │
└─────────────────┘
```

## CSS Variables Used

### From custom.css
```css
--ifm-color-primary           /* #2E8555 */
--ifm-color-primary-dark      /* #297a4d */
--ifm-color-primary-light     /* #338f5e */
--ifm-background-color        /* Theme-dependent */
--ifm-font-color-base         /* Theme-dependent */
--ifm-color-emphasis-700      /* Theme-dependent */
--ifm-color-emphasis-200      /* Theme-dependent */
--ifm-card-border-radius      /* 12px */
--ifm-button-border-radius    /* 8px */
--ifm-line-height-base        /* 1.65 */
```

### Custom Shadows
```css
--ifm-global-shadow-lw        /* Light */
--ifm-global-shadow-md        /* Medium */
--ifm-global-shadow-tl        /* Tall/Hover */
```

## State Management

### Hover States
```css
.topicBlock:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(46, 133, 85, 0.12);
  border-color: var(--ifm-color-primary-light);
}

.topicLink:hover {
  transform: translateX(4px);
}

.heroButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(46, 133, 85, 0.2);
}
```

### Transitions
All interactive elements have:
```css
transition: all 0.3s ease;    /* Cards */
transition: all 0.25s ease;   /* Buttons */
transition: all 0.2s ease;    /* Links */
```

## Import Dependencies

### Required Imports
```javascript
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
```

### Docusaurus Components Used
- `Layout`: Page wrapper with navbar/footer
- `Link`: Client-side navigation
- `clsx`: Conditional class names
- `useDocusaurusContext`: Site config access

## File Dependencies

```
index.js
├── Imports
│   ├── React (core)
│   ├── clsx (utility)
│   ├── @theme/Layout (Docusaurus)
│   ├── @docusaurus/Link (Docusaurus)
│   ├── useDocusaurusContext (Docusaurus)
│   └── index.module.css (styles)
│
├── Data
│   └── TopicBlocks (array of 6 modules)
│
├── Components
│   ├── HomepageHero
│   ├── WhatThisBookCovers
│   ├── MotivationSection
│   └── ChaptersOverview
│
└── Default Export
    └── Home (wraps all in Layout)
```

## Customization Points

### Easy to Change
1. **Module Count:** Modify TopicBlocks array
2. **Colors:** Change CSS variables in custom.css
3. **Spacing:** Adjust padding values
4. **Typography:** Modify font-size variables
5. **Links:** Update href/to attributes

### Medium Difficulty
1. **Add new section:** Create component + add to Home
2. **Change grid layout:** Modify grid-template-columns
3. **Add animations:** Extend transition properties
4. **Custom hover effects:** Add new CSS rules

### Advanced
1. **Dynamic module data:** Fetch from API/CMS
2. **Add filtering:** State management for modules
3. **Search functionality:** Integrate search UI
4. **Interactive demos:** Embed code sandboxes

## Performance Considerations

### Optimizations Applied
- ✅ CSS Modules (scoped, no conflicts)
- ✅ Static data (no unnecessary re-renders)
- ✅ Semantic HTML (better parsing)
- ✅ Minimal JavaScript (mostly CSS)
- ✅ No external dependencies for UI

### Bundle Size Impact
```
index.js:              ~5KB (with formatting)
index.module.css:      ~8KB (with comments)
custom.css:            ~6KB (with comments)
Total homepage code:   ~19KB
```

## Accessibility Features

### Implemented
- ✅ Semantic HTML5 elements
- ✅ ARIA-friendly structure
- ✅ Keyboard navigation (Docusaurus)
- ✅ Focus states on buttons
- ✅ Sufficient color contrast
- ✅ Readable typography scale

### Testing Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Chrome Lighthouse

## SEO Considerations

### Meta Information
```javascript
<Layout
  title={`Home`}
  description="A comprehensive guide to understanding..."
>
```

### Heading Hierarchy
```
h1: Hero title (Physical AI & Humanoid Robotics)
h2: Section headings (What This Textbook Covers, Why...)
h3: Module titles (ROS 2 Foundations, etc.)
```

### Semantic Structure
- `<header>` for hero
- `<main>` for content
- `<section>` for logical sections
- `<nav>` from Docusaurus Layout

## Browser Compatibility

### Tested/Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari iOS 14+
- ✅ Chrome Android 90+

### CSS Features Used
- CSS Grid (2017+)
- CSS Variables (2016+)
- Flexbox (2015+)
- Transform & Transition (2013+)

All have >95% global browser support.

---

**Reference Date:** December 6, 2025
**Framework:** Docusaurus 3.x
**React Version:** 18.x
