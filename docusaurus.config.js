const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A Comprehensive Guide to Intelligent Robotics',
  url: 'https://ai-humanoid-book-six.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  markdown: {
    // Docusaurus internal options
    // The following options are only used by Docusaurus internal tooling,
    // and generally don't need to be customized by users
    // See https://docusaurus.io/docs/api/docusaurus-config/#markdown
    // parseFrontMatter: async ({filePath, fileContent}) => {},
    // rehypePlugins: [],
    // remarkPlugins: [],
    // headers: 'auto',
    // lineNumbering: false,
    // mermaidFallback: {},

    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
  },

  organizationName: 'your-organization',
  projectName: 'physical-ai-humanoid-robotics-book',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl: 'https://github.com/your-repo-link/edit/main/',
          remarkPlugins: [require('remark-mermaid')],
          // Use the textbookSidebar from sidebars.js
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
          {
            href: 'https://github.com/AhmedHKhan18',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          i18n: {
          defaultLocale: 'en',
          locales: ['en', 'ur'],
          localeConfigs: {
              ur: {
              label: 'اردو',
              direction: 'rtl',
            },
          },
        },
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