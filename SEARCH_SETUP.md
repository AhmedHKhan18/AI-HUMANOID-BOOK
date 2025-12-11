# Search Configuration Guide

This document explains how to configure search for your Docusaurus book with both local search and Algolia DocSearch options.

## Current Setup: Local Search (Default)

The local search plugin `@easyops-cn/docusaurus-search-local` is currently configured as the default search provider.

### Features:
- Indexes all `/docs/**` content
- Indexes all blog posts
- Indexes all pages
- Supports English and Urdu languages
- RTL support for Urdu
- Highlights search terms on target page
- Keyboard shortcut `/` to focus search
- Works offline after initial build

### How it works:
1. During build, all content is indexed locally
2. Search runs entirely client-side
3. No external API calls needed

---

## Alternative: Algolia DocSearch

To switch to Algolia DocSearch for production use:

### Step 1: Apply for DocSearch
Visit: https://docsearch.algolia.com/apply/

### Step 2: Update `docusaurus.config.js`

Replace the `themes` section with:

```javascript
// Remove or comment out the local search theme:
// themes: [
//   ['@easyops-cn/docusaurus-search-local', {...}]
// ],

// Add Algolia configuration in themeConfig:
themeConfig: {
  // ... other config
  algolia: {
    // The application ID provided by Algolia
    appId: 'YOUR_APP_ID',

    // Public API key: safe to commit
    apiKey: 'YOUR_SEARCH_API_KEY',

    indexName: 'YOUR_INDEX_NAME',

    // Optional: Contextual search (for versioned docs)
    contextualSearch: true,

    // Optional: Specify domains where the navigation should occur
    externalUrlRegex: 'external\\.com|domain\\.com',

    // Optional: Replace parts of the item URLs
    replaceSearchResultPathname: {
      from: '/docs/', // or as defined in docusaurus.config.js
      to: '/',
    },

    // Optional: Algolia search parameters
    searchParameters: {},

    // Optional: Path for search page (disabled by default)
    searchPagePath: 'search',

    // Optional: Insights feature
    insights: false,

    // Translations for Urdu locale
    translations: {
      button: {
        buttonText: 'تلاش کریں',
        buttonAriaLabel: 'تلاش کریں',
      },
      modal: {
        searchBox: {
          resetButtonTitle: 'استفسار صاف کریں',
          resetButtonAriaLabel: 'استفسار صاف کریں',
          cancelButtonText: 'منسوخ کریں',
          cancelButtonAriaLabel: 'منسوخ کریں',
        },
        startScreen: {
          recentSearchesTitle: 'حالیہ تلاشیں',
          noRecentSearchesText: 'کوئی حالیہ تلاشیں نہیں',
          saveRecentSearchButtonTitle: 'اس تلاش کو محفوظ کریں',
          removeRecentSearchButtonTitle: 'تاریخ سے ہٹائیں',
          favoriteSearchesTitle: 'پسندیدہ',
          removeFavoriteSearchButtonTitle: 'پسندیدہ سے ہٹائیں',
        },
        errorScreen: {
          titleText: 'نتائج حاصل کرنے میں ناکام',
          helpText: 'اپنا نیٹ ورک کنکشن چیک کریں',
        },
        footer: {
          selectText: 'منتخب کریں',
          navigateText: 'نیویگیٹ کریں',
          closeText: 'بند کریں',
          searchByText: 'سے تلاش',
        },
        noResultsScreen: {
          noResultsText: 'کوئی نتائج نہیں ملے',
          suggestedQueryText: 'تلاش کریں',
          reportMissingResultsText: 'کیا یہ تلاش نتائج دینی چاہیے؟',
          reportMissingResultsLinkText: 'ہمیں بتائیں',
        },
      },
    },
  },
}
```

### Step 3: Create Algolia Crawler Config

Create an `algolia-crawler-config.json` for your site:

```json
{
  "index_name": "physical-ai-humanoid-robotics",
  "start_urls": [
    "https://ai-humanoid-book-six.vercel.app/"
  ],
  "sitemap_urls": [
    "https://ai-humanoid-book-six.vercel.app/sitemap.xml"
  ],
  "selectors": {
    "lvl0": {
      "selector": ".menu__link--sublist.menu__link--active",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": "article h1",
    "lvl2": "article h2",
    "lvl3": "article h3",
    "lvl4": "article h4",
    "lvl5": "article h5",
    "lvl6": "article h6",
    "content": "article p, article li, article td"
  },
  "strip_chars": " .,;:#",
  "custom_settings": {
    "separatorsToIndex": "_",
    "attributesForFaceting": [
      "language",
      "version"
    ],
    "attributesToSnippet": [
      "content:10"
    ]
  }
}
```

---

## RTL Support for Urdu

Both search options include full RTL support:

### Automatic Features:
- Search input text aligns right-to-left
- Results modal displays RTL
- Placeholder text in Urdu: "تلاش کریں..."
- All search UI elements use Noto Nastaliq Urdu font

### CSS Classes Applied:
- `search-bar-rtl` - Applied when locale is Urdu
- `html[lang='ur']` - Targets all Urdu-specific styling

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Esc` | Close search / blur input |
| `↑` / `↓` | Navigate results |
| `Enter` | Select result |

---

## i18n Files Structure

Search translations are located in:
```
i18n/
└── ur/
    ├── code.json (general theme translations)
    └── docusaurus-theme-search-local/
        └── default.json (search-specific translations)
```

---

## Troubleshooting

### Search not working in development?
The local search plugin only indexes content during production build. Run:
```bash
npm run build
npm run serve
```

### Search not finding Urdu content?
Ensure the `language` array includes `'ur'`:
```javascript
language: ['en', 'ur'],
```

### Results not highlighting?
Check that `highlightSearchTermsOnTargetPage: true` is set in the plugin config.

---

## Performance Tips

1. **Limit result count**: Set `searchResultLimits: 8` to keep results manageable
2. **Use hashed index**: Enable `hashed: true` for cache-friendly URLs
3. **Context length**: Adjust `searchResultContextMaxLength: 50` for snippet size
