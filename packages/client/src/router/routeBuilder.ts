import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import type { RouteConfig } from '@/types'
import { resolveLayout, resolveView } from './componentResolver'

function buildChildren(config: RouteConfig[]): RouteRecordRaw[] {
  return config.map(item => ({
    path: item.path,
    name: item.name,
    component: resolveView(item.component),
    meta: item.meta as unknown as RouteMeta
  })) as RouteRecordRaw[]
}

export function buildRouteRecords(configList: RouteConfig[]): RouteRecordRaw[] {
  const layoutMap = new Map<string, RouteRecordRaw>()

  configList.forEach(config => {
    const layoutName = config.meta.layout || 'DefaultLayout'
    if (!layoutMap.has(layoutName)) {
      layoutMap.set(layoutName, {
        path: '/',
        component: resolveLayout(layoutName),
        redirect: '',
        children: []
      })
    }
    const layoutRecord = layoutMap.get(layoutName)!
    layoutRecord.children!.push({
      path: config.path.startsWith('/') ? config.path.slice(1) : config.path,
      name: config.name,
      component: resolveView(config.component),
      meta: config.meta as unknown as RouteMeta,
      children: config.children ? buildChildren(config.children) : undefined
    } as RouteRecordRaw)
  })

  const records: RouteRecordRaw[] = []
  layoutMap.forEach(record => {
    if (record.children && record.children.length > 0) {
      record.redirect = record.children[0].path.startsWith('/')
        ? record.children[0].path
        : '/' + record.children[0].path
      records.push(record)
    }
  })

  return records
}
