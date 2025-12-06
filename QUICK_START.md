# Quick Start Guide

## 🚀 Get Your New Homepage Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
Opens at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
npm run serve
```

## 📝 Quick Customizations

### Update GitHub Link
**File:** `docusaurus.config.js` (line 68)
```javascript
href: 'https://github.com/YOUR-USERNAME/YOUR-REPO',
```

### Update Module Links
**File:** `src/pages/index.js` (line 79)
```javascript
<Link to={`/docs/YOUR-MODULE-PATH`} className={styles.topicLink}>
```

### Update Social Links
**File:** `docusaurus.config.js` (lines 89-101)
```javascript
{
  label: 'LinkedIn',
  href: 'https://linkedin.com/in/YOUR-PROFILE',
},
```

### Change Colors
**File:** `src/css/custom.css` (line 9)
```css
--ifm-color-primary: #2E8555; /* Your color here */
```

## 🎨 What Changed

### Homepage Structure
1. ✅ Clean hero with title + subtitle + 3 buttons
2. ✅ 6 module cards with "Open Module →" links
3. ✅ AI-Native motivation section
4. ✅ Learning path CTA section

### Navigation
1. ✅ Simplified navbar (Textbook + GitHub only)
2. ✅ Minimalist footer
3. ✅ Clean copyright line

### Design System
1. ✅ Academic typography scale
2. ✅ 96px section spacing
3. ✅ Subtle shadows and hover effects
4. ✅ Professional green color palette
5. ✅ Fully responsive (mobile/tablet/desktop)

## 🔧 Files Modified

```
✓ src/pages/index.js          (Homepage component)
✓ src/pages/index.module.css  (Component styles)
✓ src/css/custom.css          (Global styles)
✓ docusaurus.config.js        (Site config)
```

## 📖 Full Documentation

See `IMPLEMENTATION_GUIDE.md` for:
- Complete customization guide
- Design specifications
- Deployment instructions
- Troubleshooting tips
- Performance optimization

## 🎯 Next Steps

1. Update GitHub and social links
2. Create your module documentation
3. Customize module links to point to actual docs
4. Deploy to Vercel/Netlify/GitHub Pages

## 📚 Resources

- [Docusaurus Docs](https://docusaurus.io/docs)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Reference Site](https://physicalhumanoidaitextbook.vercel.app/)

---

**Need help?** Check `IMPLEMENTATION_GUIDE.md` or Docusaurus documentation.
