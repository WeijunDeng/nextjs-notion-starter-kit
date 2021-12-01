import { ExtendedRecordMap } from 'notion-types'
import { uuidToId } from 'notion-utils'
import { getPageProperty } from 'notion-utils'

import {
  parsePageId,
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

/**
 * Gets the canonical, display-friendly version of a page's ID for use in URLs.
 */
 const getCanonicalPageId_private = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  if (!pageId || !recordMap) return null

  const id = uuidToId(pageId)
  const block = recordMap.block[pageId]?.value

  if (block) {
    const title = normalizeTitle_private(getPageProperty("Pretty", block, recordMap))

    if (title) {
      if (uuid) {
        return `${title}-${id}`
      } else {
        return title
      }
    }
  }

  return id
}

const normalizeTitle_private = (title: string | null): string => {
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
    return getCanonicalPageId_private(pageId, recordMap, {
      uuid
    })
  }
}
