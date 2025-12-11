const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A Comprehensive Guide to Intelligent Robotics',
  url: 'https://ai-humanoid-book-six.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: './static/img/robot-img.png',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  // ============================================
  // I18N CONFIGURATION - English & Urdu
  // ============================================
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur-PK',
      },
    },
  },

  organizationName: 'your-organization',
  projectName: 'physical-ai-humanoid-robotics-book',

  // ============================================
  // THEMES - Local Search Plugin
  // ============================================
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // Index all docs content
        indexDocs: true,
        indexBlog: false, // Disabled - no blog directory
        indexPages: true,

        // Language support - Note: lunr-languages doesn't support Urdu
        // Urdu content will still be indexed using English stemmer
        language: ['en'],

        // Search bar behavior
        hashed: true,

        // Highlight search terms in results
        highlightSearchTermsOnTargetPage: true,

        // Explode heading segments for better matching
        explicitSearchResultPath: true,

        // Search result limit
        searchResultLimits: 8,

        // Search result context length
        searchResultContextMaxLength: 50,

        // Note: Translations are handled via i18n files in:
        // i18n/ur/docusaurus-theme-search-local/default.json
      }),
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require('remark-mermaid')],
          sidebarCollapsible: true,
          sidebarCollapsed: true,
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        hideOnScroll: false,
        items: [
          {
            to: '/docs/intro',
            label: 'Textbook',
            position: 'left',
          },
          // Search bar - positioned on the right
          {
            type: 'search',
            position: 'right',
          },
          {
            href: 'https://github.com/AhmedHKhan18',
            label: 'GitHub',
            position: 'right',
          },
          // Language toggle dropdown
          {
            type: 'localeDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                type: 'html',
                value: '<hr style="margin: 0.3rem 0;">',
              },
              {
                href: 'https://github.com/AhmedHKhan18',
                label: 'Help translate',
              },
            ],
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/AhmedHKhan18',
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/ahmed-hassankhan',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/your-twitter',
              },
            ],
          },
        ],
        copyright: `Built with ❤️ by Ahmed Hassan Khan · © ${new Date().getFullYear()}`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

module.exports = config;
