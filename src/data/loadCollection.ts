import type { CollectionItem, RawCollectionItem } from '../domain/types'
import { API_URL } from './constants'

interface RawData {
  collection?: RawCollectionItem[]
}

// Guard check
function isCollectionItem(raw: RawCollectionItem): raw is CollectionItem {
  return (
    typeof raw?.id === 'number' &&
    typeof raw?.title === 'string' &&
    typeof raw?.images?.artwork_portrait === 'string'
  )
}

// Sanitise layer
export function parseCollection(data: RawData): CollectionItem[] {
  const raw = data?.collection ?? []

  return raw.filter(isCollectionItem)
}

export async function loadCollectionAsync(): Promise<CollectionItem[]> {
  const response = await fetch(API_URL)

  if (!response.ok) throw new Error(`Failed to load collection: ${response.status}`)

  const data = (await response.json()) as RawData

  return parseCollection(data)
}
