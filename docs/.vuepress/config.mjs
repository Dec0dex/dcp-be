import { viteBundler } from '@vuepress/bundler-vite';
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { en as enThemeConfig } from './config/theme/en.config.mjs';

export default defineUserConfig({
  lang: 'en-US',
  title: 'DCP Backend',
  description: 'Developer Community Platform API',
  base: '/dcp-be/',
  bundler: viteBundler(),
  markdown: {
    toc: {
      level: [2, 3, 4, 5],
    },
  },
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Developer Community Platform API 🎉',
    },
  },
  theme: defaultTheme({
    repo: 'vndevteam/nestjs-boilerplate',
    docsBranch: 'main',
    docsDir: 'docs',
    locales: {
      '/': enThemeConfig,
    },
  }),
  plugins: [
    searchPlugin({
      maxSuggestions: 15,
      hotKeys: ['s', '/'],
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/vi/': {
          placeholder: 'Tìm kiếm',
        },
      },
    }),
    // guides: https://plugin-md-enhance.vuejs.press/guide/
    mdEnhancePlugin({
      tasklist: true,
      imgLazyload: true,
      imgSize: true,
      figure: true,
      tabs: true,
      align: true,
    }),
  ],
});
