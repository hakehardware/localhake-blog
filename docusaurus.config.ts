import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Hake's Homelab",
  tagline: 'Homelab tutorials and documentation',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://hakes-homelab.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'hake-hardware',
  projectName: 'hakes-homelab',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Enable MDX format and Mermaid diagrams
  markdown: {
    format: 'mdx',
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          path: 'docs',
          routeBasePath: 'wiki',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hake-hardware/hakes-homelab/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hake-hardware/hakes-homelab/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Hake's Homelab",
      items: [
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/wiki/intro', label: 'Wiki', position: 'left' },
        {
          href: 'https://youtube.com/@HakeHardware',
          label: 'YouTube',
          position: 'right',
        },
        {
          href: 'https://github.com/hake-hardware/hakes-homelab',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Wiki',
              to: '/wiki/intro',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'YouTube',
              href: 'https://youtube.com/@HakeHardware',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hake-hardware/hakes-homelab',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hake's Homelab. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
