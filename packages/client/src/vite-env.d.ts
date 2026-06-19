/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMeta {
  glob<T = unknown>(pattern: string, options?: { eager?: boolean }): Record<string, T>
}
