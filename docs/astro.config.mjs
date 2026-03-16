import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightTypeDoc from 'starlight-typedoc'
import remarkGithubAlerts from 'remark-github-alerts'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const sidebar = require('./sidebar.config.json')

export default defineConfig({
  site: 'https://algorandfoundation.github.io',
  base: '/algokit-utils-ts-debug/',
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
  },
  integrations: [
    starlight({
      title: 'algokit-utils-ts-debug',
      customCss: ['remark-github-alerts/styles/github-colors-light.css', 'remark-github-alerts/styles/github-colors-dark-media.css', 'remark-github-alerts/styles/github-base.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/algorandfoundation/algokit-utils-ts-debug' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/algorand' },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: ['../src/index.ts'],
          tsconfig: '../tsconfig.build.json',
          output: 'api',
          sidebar: {
            label: 'API Reference',
            collapsed: true,
          },
          typeDoc: {
            excludeReferences: true,
            gitRevision: 'main',
            entryFileName: 'index',
          },
        }),
      ],
      sidebar,
      editLink: {
        baseUrl: 'https://github.com/algorandfoundation/algokit-utils-ts-debug/edit/main/docs/',
      },
    }),
  ],
})
