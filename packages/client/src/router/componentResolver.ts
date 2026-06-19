import type { Component } from 'vue'

const layoutModules = import.meta.glob<Component>('../layouts/*.vue', { eager: true })
const viewModules = import.meta.glob<Component>('../views/**/*.vue', { eager: true })

function resolveByPath(modules: Record<string, unknown>, name: string): Component | undefined {
  const entries = Object.entries(modules)
  for (const [path, mod] of entries) {
    const base = path.split('/').pop()?.replace(/\.vue$/, '')
    if (base === name) {
      return (mod as { default: Component }).default
    }
  }
  return undefined
}

export function resolveLayout(name: string): Component {
  const found = resolveByPath(layoutModules, name)
  if (found) return found
  const fallback = resolveByPath(layoutModules, 'DefaultLayout')
  if (fallback) return fallback
  throw new Error(`Layout not found: ${name}`)
}

export function resolveView(name: string): Component {
  const found = resolveByPath(viewModules, name)
  if (found) return found
  throw new Error(`View not found: ${name}`)
}
