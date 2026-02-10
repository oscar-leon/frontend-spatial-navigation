export interface CollectionItem {
  id: number
  title: string
  images: {
    artwork_portrait: string
  }
}

export interface RawCollectionItem {
  id?: number
  title?: string
  images?: {
    artwork_portrait?: string
  }
}

export type FocusDirection = 'next' | 'prev'
export type RowFocusDirection = 'up' | 'down'
