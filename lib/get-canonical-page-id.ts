import { ExtendedRecordMap } from 'notion-types'
import {
  parsePageId,
  getCanonicalPageId as getCanonicalPageIdImpl
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

const normalizeCanonicalPageId = (title: string | null): string => {
  return (title || '')
    .replace(/_+/g, '-')
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    return normalizeCanonicalPageId(getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    }))
  }
}
