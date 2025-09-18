import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import type { UserConfig } from 'vite'

const baseViteConfig: UserConfig = typeof viteConfig === 'function'
  ? await viteConfig({ mode: 'test', command: 'serve' })
  : (viteConfig as UserConfig)

export default mergeConfig(
  baseViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
